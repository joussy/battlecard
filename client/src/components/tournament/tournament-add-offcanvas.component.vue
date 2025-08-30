<template>
    <OffcanvasComponent v-model="showOffcanvas">
        <template #header>
            <h5
                id="tournamentAddOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                <i class="bi bi-calendar-plus me-2"></i>
                {{ mode == "create" ? $t("tournamentAdd.addEvent") : $t("tournamentAdd.editEvent") }}
            </h5>
        </template>
        <form
            class=""
            @submit="onSubmit"
        >
            <div class="mb-3">
                <label
                    for="name"
                    class="form-label"
                >
                    <i class="bi bi-trophy me-2"></i>{{ $t("tournamentAdd.name") }}
                </label>
                <input
                    v-model="name"
                    class="form-control"
                    type="text"
                    :class="{
                        'is-invalid': errors.name?.length ?? 0 > 0,
                    }"
                />
                <span
                    name="name"
                    class="invalid-feedback"
                    >{{ errors.name }}</span
                >
            </div>
            <div class="mb-3">
                <label
                    for="date"
                    class="form-label"
                >
                    <i class="bi bi-calendar3 me-2"></i>{{ $t("tournamentAdd.date") }}
                </label>
                <input
                    v-model="date"
                    class="form-control"
                    type="date"
                    :class="{
                        'is-invalid': errors.date?.length ?? 0 > 0,
                    }"
                />
                <span
                    name="date"
                    class="invalid-feedback"
                    >{{ errors.date }}</span
                >
            </div>
            <div class="mb-3">
                <label
                    for="address"
                    class="form-label"
                >
                    <i class="bi bi-geo-alt me-2"></i>{{ $t("tournamentAdd.address") }}
                </label>
                <AddressAutocompleteField
                    id="address"
                    v-model="address"
                    :label="$t('tournamentAdd.address')"
                    :placeholder="$t('tournamentAdd.addressPlaceholder')"
                    @select="onAddressSelect"
                />
                <span
                    name="address"
                    class="invalid-feedback"
                    >{{ errors.address }}</span
                >
            </div>
            <div class="mb-3">
                <label
                    for="zipCode"
                    class="form-label"
                >
                    <i class="bi bi-mailbox me-2"></i>{{ $t("tournamentAdd.zipCode") }}
                </label>
                <input
                    v-model="zipCode"
                    class="form-control"
                    type="text"
                    :class="{
                        'is-invalid': errors.zipCode?.length ?? 0 > 0,
                    }"
                />
                <span
                    name="zipCode"
                    class="invalid-feedback"
                    >{{ errors.zipCode }}</span
                >
            </div>
            <div class="mb-3">
                <label
                    for="city"
                    class="form-label"
                >
                    <i class="bi bi-buildings me-2"></i>{{ $t("tournamentAdd.city") }}
                </label>
                <input
                    v-model="city"
                    class="form-control"
                    type="text"
                    :class="{
                        'is-invalid': errors.city?.length ?? 0 > 0,
                    }"
                />
                <span
                    name="city"
                    class="invalid-feedback"
                    >{{ errors.city }}</span
                >
            </div>
            <button
                type="submit"
                class="btn btn-success"
            >
                <i class="bi bi-save me-2"></i>
                {{ mode == "create" ? $t("tournamentAdd.createEvent") : $t("tournamentAdd.updateEvent") }}
            </button>
        </form>
    </OffcanvasComponent>
</template>

<script lang="ts" setup>
import { watch, computed } from "vue"
import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { useI18n } from "vue-i18n"
import { Tournament } from "@/types/boxing.d"
import AddressAutocompleteField from "@/components/shared/core/address-autocomplete-field.component.vue"
import { TournamentOpenApi, CreateTournamentDto, UpdateTournamentDto, AddressAutocompleteDto } from "@/api"
import OffcanvasComponent from "@/components/shared/core/offcanvas.component.vue"

const { t: $t } = useI18n()
const showOffcanvas = defineModel<boolean>()

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return $t("tournamentAdd.validation.required")
    }
    return true
})

const props = defineProps<{ tournament?: Tournament | null }>()
const emit = defineEmits<{ (e: "tournament-saved", tournamentId: string): void }>()

// Create the form
const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: {
        name: "required",
        date: "required",
    },
})

// Define fields
const [name] = defineField("name")
const [date] = defineField("date")
const [address] = defineField("address")
const [zipCode] = defineField("zipCode")
const [city] = defineField("city")

const mode = computed<"create" | "edit">(() => (props.tournament ? "edit" : "create"))

// Sync prop into fields
watch(
    () => props.tournament,
    (t) => {
        resetForm()
        name.value = t?.name || ""
        date.value = t?.date || ""
        address.value = t?.address || ""
        zipCode.value = t?.zipCode || ""
        city.value = t?.city || ""
    },
    { immediate: true }
)

const onSubmit = handleSubmit(async (form: GenericObject) => {
    const formTournament = {
        name: form.name,
        date: form.date,
        address: form.address || undefined,
        zipCode: form.zipCode || undefined,
        city: form.city || undefined,
    }
    let tournamentId = ""
    if (props.tournament) {
        await TournamentOpenApi.update({
            path: { id: props.tournament.id },
            body: formTournament as UpdateTournamentDto,
        })
        tournamentId = props.tournament.id
    } else {
        const res = await TournamentOpenApi.create({
            body: formTournament as CreateTournamentDto,
        })
        if (!res) return
        tournamentId = res.id
    }
    emit("tournament-saved", tournamentId)
    resetForm()
    showOffcanvas.value = false
})

function onAddressSelect(suggestion: AddressAutocompleteDto) {
    if (suggestion.zipCode) zipCode.value = suggestion.zipCode
    if (suggestion.city) city.value = suggestion.city
}
</script>
