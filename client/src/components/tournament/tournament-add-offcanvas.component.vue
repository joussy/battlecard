<template>
    <div
        id="tournamentAddOffcanvasNavbar"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="tournamentAddOffcanvasNavbarLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="tournamentAddOffcanvasNavbarLabel"
                class="offcanvas-title"
            >
                <i class="bi bi-calendar-plus me-2"></i>
                {{ mode == "create" ? "Add new event" : "Edit event" }}
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <form
                class=""
                @submit="onSubmit"
            >
                <div class="mb-3">
                    <label
                        for="name"
                        class="form-label"
                    >
                        <i class="bi bi-trophy me-2"></i>Name
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
                        <i class="bi bi-calendar3 me-2"></i>Date
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
                        <i class="bi bi-geo-alt me-2"></i>Address
                    </label>
                    <AddressAutocompleteField
                        id="address"
                        v-model="address"
                        :label="'Address'"
                        placeholder="Start typing address..."
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
                        <i class="bi bi-mailbox me-2"></i>ZIP Code
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
                        <i class="bi bi-buildings me-2"></i>City
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
                    {{ mode == "create" ? "Create" : "Update" }} event
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch, computed } from "vue"
import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { Tournament } from "@/types/boxing.d"
import { closeModal } from "@/utils/ui.utils"
import AddressAutocompleteField from "@/components/shared/core/address-autocomplete-field.component.vue"
import { TournamentOpenApi, CreateTournamentDto, UpdateTournamentDto, AddressAutocompleteDto } from "@/api"

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return "This field is required"
    }
    return true
})

const props = defineProps<{ tournament?: Tournament | null }>()
const emit = defineEmits<{ (e: "tournament-saved", payload: unknown): void }>()

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
    if (props.tournament) {
        await TournamentOpenApi.update({
            path: { id: props.tournament.id },
            body: formTournament as UpdateTournamentDto,
        })
    } else {
        await TournamentOpenApi.create({
            body: formTournament as CreateTournamentDto,
        })
    }
    emit("tournament-saved", formTournament)
    resetForm()
    closeModal("#tournamentAddOffcanvasNavbar")
})

function onAddressSelect(suggestion: AddressAutocompleteDto) {
    if (suggestion.zipCode) zipCode.value = suggestion.zipCode
    if (suggestion.city) city.value = suggestion.city
}
</script>
