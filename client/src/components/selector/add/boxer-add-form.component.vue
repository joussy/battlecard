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
                <i class="bi bi-person-vcard me-2"></i>License
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
                Last Name
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
                First Name
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
                    Gender
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
                    ><i class="bi bi-gender-female me-2"></i>Female</label
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
                    ><i class="bi bi-gender-male me-2"></i> Male</label
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
                />Birth Date
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
                />Weight
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
                <i class="bi bi-house-fill me-2"></i>Club
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
            Save Boxer
        </button>
    </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { Boxer } from "@/types/boxing.d"
import { isValid, format } from "date-fns"
import IconComponent from "@/components/shared/core/icon.component.vue"

import { Gender } from "@/shared/types/modality.type"
import { ApiBoxerCreate } from "@/shared/types/api"
import apiManager from "@/managers/api.manager"

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return "This field is required"
    }
    return true
})
defineRule("weightRequired", (value: string) => {
    if (!value) {
        return "This field is required and must be a number greater than or equal to 1"
    }

    // Check for invalid characters
    const validFormat = /^-?\d+([.,]\d+)?$/
    if (!validFormat.test(value)) {
        return "Please enter a valid number (digits only, with optional comma or dot)"
    }

    return true
})
defineRule("genderRequired", (value: string) => {
    if (!value || value == "none") {
        return "This field is required"
    }
    return true
})
export default defineComponent({
    components: { IconComponent },
    props: {
        boxer: {
            type: Object as PropType<Boxer | null>,
            required: false,
            default: null,
        },
    },
    emits: ["boxer-saved"],
    setup() {
        const { defineField, handleSubmit, errors, resetForm } = useForm({
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
        return {
            handleSubmit,
            lastname,
            errors,
            firstname,
            weight,
            license,
            club,
            resetForm,
            gender,
            birthdate,
            clubsAutoCompleteList: [] as string[],
            Gender,
        }
    },
    data() {
        return {
            onSubmit: (() => {}) as (e: Event) => void,
        }
    },
    watch: {
        boxer: {
            handler() {
                this.lastname = this.boxer?.lastName ?? ""
                this.firstname = this.boxer?.firstName ?? ""
                this.weight = this.boxer?.weight ?? ""
                this.license = this.boxer?.license ?? ""
                this.club = this.boxer?.club ?? ""
                this.birthdate = isValid(this.boxer?.birthDate) ? format(this.boxer!.birthDate, "yyyy-MM-dd") : ""
                this.gender = this.boxer ? this.boxer.gender : ""
            },
            immediate: true,
        },
    },
    mounted() {
        this.clubsAutoCompleteList = []
    },
    created() {
        this.onSubmit = this.handleSubmit(async (form: GenericObject) => {
            let boxer: ApiBoxerCreate = {
                birthDate: form.birthdate,
                club: form.club,
                firstName: form.firstname,
                lastName: form.lastname,
                gender: form.gender == Gender.FEMALE ? Gender.FEMALE : Gender.MALE,
                weight: parseInt(form.weight),
                license: form.license,
                nbFights: 0,
            }
            if (this.boxer?.id) {
                await apiManager.updateBoxer(boxer, this.boxer.id)
            } else {
                await apiManager.addBoxer(boxer)
            }
            this.$emit("boxer-saved", boxer)
        })
    },
})
</script>
