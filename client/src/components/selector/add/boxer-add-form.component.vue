<template>
    <form
        class=""
        @submit="onSubmit"
    >
        <div class="mb-3">
            <label
                for="license"
                class="form-label"
            >
                <i class="bi bi-person-vcard me-2"></i>{{ $t("addBoxer.license") }}
            </label>
            <input
                v-model="license"
                class="form-control"
                type="text"
                :class="{
                    'is-invalid': errors.license?.length ?? 0 > 0,
                }"
            />
            <span
                name="license"
                class="invalid-feedback"
                >{{ errors.license }}</span
            >
        </div>
        <div class="mb-3">
            <label
                for="lastname"
                class="form-label"
            >
                {{ $t("addBoxer.lastName") }}
            </label>
            <input
                v-model="lastname"
                class="form-control"
                type="text"
                :class="{
                    'is-invalid': errors.lastname?.length ?? 0 > 0,
                }"
            />
            <span
                name="lastname"
                class="invalid-feedback"
                >{{ errors.lastname }}</span
            >
        </div>
        <div class="mb-3">
            <label
                for="firstname"
                class="form-label"
            >
                {{ $t("addBoxer.firstName") }}
            </label>
            <input
                v-model="firstname"
                class="form-control"
                type="text"
                :class="{
                    'is-invalid': errors.firstname?.length ?? 0 > 0,
                }"
            />
            <span
                name="firstname"
                class="invalid-feedback"
                >{{ errors.firstname }}</span
            >
        </div>
        <div class="mb-3">
            <div>
                <label
                    for="gender"
                    class="form-label"
                >
                    {{ $t("addBoxer.gender") }}
                </label>
            </div>
            <div
                class="btn-group"
                role="group"
            >
                <input
                    id="gender_1"
                    v-model="gender"
                    type="radio"
                    class="btn-check"
                    name="gender"
                    autocomplete="off"
                    :value="Gender.FEMALE"
                />
                <label
                    class="btn btn-outline-danger"
                    for="gender_1"
                    ><i class="bi bi-gender-female me-2"></i>{{ $t("addBoxer.female") }}</label
                >

                <input
                    id="gender_2"
                    v-model="gender"
                    type="radio"
                    class="btn-check"
                    name="gender"
                    autocomplete="off"
                    :value="Gender.MALE"
                />
                <label
                    class="btn btn-outline-primary"
                    for="gender_2"
                    ><i class="bi bi-gender-male me-2"></i> {{ $t("addBoxer.male") }}</label
                >
            </div>
            <div
                v-if="errors.gender?.length ?? 0 > 0"
                name="btnradio"
                class="invalid-feedback"
                style="display: block !important"
            >
                {{ errors.gender }}
            </div>
        </div>
        <div class="mb-3">
            <label
                for="birthdate"
                class="form-label"
            >
                <IconComponent
                    name="birthday-cake"
                    class="me-1"
                />{{ $t("addBoxer.birthDate") }}
            </label>
            <input
                v-model="birthdate"
                class="form-control"
                type="date"
                :class="{
                    'is-invalid': errors.birthdate?.length ?? 0 > 0,
                }"
            />
            <span
                name="birthdate"
                class="invalid-feedback"
                >{{ errors.weight }}</span
            >
        </div>

        <div class="mb-3">
            <label
                for="weight"
                class="form-label"
            >
                <IconComponent
                    name="scale"
                    class="me-2"
                />{{ $t("addBoxer.weight") }}
            </label>
            <input
                v-model="weight"
                class="form-control"
                type="text"
                :class="{
                    'is-invalid': errors.weight?.length ?? 0 > 0,
                }"
            />
            <span
                name="weight"
                class="invalid-feedback"
                >{{ errors.weight }}</span
            >
        </div>
        <div class="mb-3">
            <label
                for="club"
                class="form-label"
            >
                <i class="bi bi-house-fill me-2"></i>{{ $t("addBoxer.club") }}
            </label>
            <input
                v-model="club"
                class="form-control"
                list="club-list"
                type="text"
                :class="{
                    'is-invalid': errors.club?.length ?? 0 > 0,
                }"
            />
            <datalist id="club-list">
                <option
                    v-for="clubName in clubsAutoCompleteList"
                    :key="clubName"
                    :value="clubName"
                ></option>
            </datalist>
            <span
                name="club"
                class="invalid-feedback"
                >{{ errors.club }}</span
            >
        </div>
        <button
            type="submit"
            class="btn btn-success"
        >
            <i class="bi bi-save me-2"></i>
            {{ $t("addBoxer.saveBoxer") }}
        </button>
    </form>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { useI18n } from "vue-i18n"
import { Boxer } from "@/types/boxing.d"
import { isValid, format } from "date-fns"
import IconComponent from "@/components/shared/core/icon.component.vue"

import { Gender } from "@/api"
import { BoxerOpenApi, CreateBoxerDto, UpdateBoxerDto } from "@/api"
import { useTournamentStore } from "@/stores/tournament.store"

const { t: $t } = useI18n()

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return $t("addBoxer.validation.required")
    }
    return true
})
defineRule("weightRequired", (value: string) => {
    if (!value) {
        return $t("addBoxer.validation.weightRequired")
    }

    // Check for invalid characters
    const validFormat = /^-?\d+([.,]\d+)?$/
    if (!validFormat.test(value)) {
        return $t("addBoxer.validation.validNumber")
    }

    return true
})
defineRule("genderRequired", (value: string) => {
    if (!value || value == "none") {
        return $t("addBoxer.validation.required")
    }
    return true
})

const props = defineProps<{ boxer?: Boxer | null }>()
const emit = defineEmits<{ (e: "boxer-saved", payload: unknown): void }>()

const tournamentStore = useTournamentStore()

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: {
        lastname: "required",
        firstname: "required",
        weight: "weightRequired",
        license: "required",
        club: "required",
        birthdate: "required",
        gender: "genderRequired",
    },
})

// Define fields
const [lastname] = defineField("lastname")
const [firstname] = defineField("firstname")
const [weight] = defineField("weight")
const [license] = defineField("license")
const [club] = defineField("club")
const [gender] = defineField("gender")
const [birthdate] = defineField("birthdate")

const clubsAutoCompleteList = ref<string[]>([])

// sync prop boxer into fields
watch(
    () => props.boxer,
    (b) => {
        lastname.value = b?.lastName ?? ""
        firstname.value = b?.firstName ?? ""
        weight.value = b?.weight ?? ""
        license.value = b?.license ?? ""
        club.value = b?.club ?? ""
        birthdate.value = isValid(b?.birthDate) ? format(b!.birthDate, "yyyy-MM-dd") : ""
        gender.value = b ? b.gender : ""
    },
    { immediate: true }
)

onMounted(() => {
    clubsAutoCompleteList.value = []
})

const onSubmit = handleSubmit(async (form: GenericObject) => {
    const boxerData = {
        birthDate: form.birthdate,
        club: form.club,
        firstName: form.firstname,
        lastName: form.lastname,
        gender: form.gender == Gender.FEMALE ? Gender.FEMALE : Gender.MALE,
        weight: parseInt(form.weight),
        license: form.license,
        nbFights: 0,
        tournamentId: tournamentStore.currentTournamentId,
    }

    if (props.boxer?.id) {
        await BoxerOpenApi.update({
            path: { id: props.boxer.id },
            body: boxerData as UpdateBoxerDto,
        })
    } else {
        await BoxerOpenApi.create({
            body: boxerData as CreateBoxerDto,
        })
    }

    emit("boxer-saved", boxerData)
})
</script>
