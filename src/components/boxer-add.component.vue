<template>
    <VForm
        class=""
        @submit="checkForm"
    >
        <div class="mb-3">
            <label
                for="lastname"
                class="form-label"
            >
                Last Name
            </label>
            <Field
                v-slot="{ field, errors }"
                name="lastname"
                rules="required"
            >
                <input
                    class="form-control"
                    type="text"
                    :class="{
                        'is-invalid': errors.length > 0,
                    }"
                    v-bind="field"
                />
            </Field>
            <ErrorMessage
                name="lastname"
                class="invalid-feedback"
            />
        </div>
        <div class="mb-3">
            <label
                for="firstname"
                class="form-label"
            >
                First Name
            </label>
            <Field
                v-slot="{ field, errors }"
                name="firstname"
                type="text"
                rules="required"
            >
                <input
                    class="form-control"
                    type="text"
                    :class="{
                        'is-invalid': errors.length > 0,
                    }"
                    v-bind="field"
                />
            </Field>
            <ErrorMessage
                name="firstname"
                class="invalid-feedback"
            />
        </div>
        <div class="mb-3">
            <div
                class="btn-group"
                role="group"
            >
                <input
                    id="male"
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    autocomplete="off"
                />
                <label
                    class="btn btn-outline-primary"
                    for="male"
                >
                    Male
                </label>
                <input
                    id="female"
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    autocomplete="off"
                />
                <label
                    class="btn btn-outline-primary"
                    for="female"
                >
                    Female
                </label>
            </div>
        </div>
        <div class="mb-3">
            <label
                for="weight"
                class="form-label"
            >
                Weight
            </label>
            <Field
                v-slot="{ field, errors }"
                name="weight"
                rules="weightRequired"
            >
                <input
                    class="form-control"
                    type="number"
                    min="0"
                    :class="{
                        'is-invalid': errors.length > 0,
                    }"
                    v-bind="field"
                />
            </Field>
            <ErrorMessage
                name="weight"
                class="invalid-feedback"
            />
        </div>
        <div class="mb-3">
            <label
                for="club"
                class="form-label"
            >
                Club
            </label>
            <Field
                v-slot="{ field, errors }"
                name="club"
                type="text"
                rules="required"
            >
                <input
                    class="form-control"
                    type="text"
                    list="club-list"
                    :class="{
                        'is-invalid': errors.length > 0,
                    }"
                    v-bind="field"
                />
                <datalist id="club-list">
                    <option
                        v-for="clubName in clubsAutoCompleteList"
                        :value="clubName"
                    ></option>
                </datalist>
            </Field>
            <ErrorMessage
                name="club"
                class="invalid-feedback"
            />
        </div>
        <div class="mb-3">
            <label
                for="birthdate"
                class="form-label"
            >
                Birth date
            </label>
            <Field
                v-slot="{ field, errors }"
                name="birthdate"
                type="text"
                rules="required"
            >
                <input
                    class="form-control"
                    type="date"
                    :class="{
                        'is-invalid': errors.length > 0,
                    }"
                    v-bind="field"
                />
            </Field>
            <ErrorMessage
                name="club"
                class="invalid-feedback"
            />
        </div>
        <div class="mb-3 col-auto">
            <label
                for="license"
                class="form-label"
            >
                License number
            </label>
            <input
                id="license"
                type="text"
                class="form-control"
            />
        </div>
        <button
            type="submit"
            class="btn btn-primary"
        >
            Submit
        </button>
    </VForm>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Gender } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import { Form, Field, ErrorMessage } from "vee-validate"

import { store } from "@/composables/fight.composable"
import { configure, defineRule } from "vee-validate"

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return "This field is required"
    }
    return true
})
defineRule("weightRequired", (value: number) => {
    if (!value || value < 1) {
        return "This field is required"
    }
    return true
})

export default defineComponent({
    components: {
        VForm: Form,
        Field: Field,
        ErrorMessage,
    },
    // props: {
    // boxer:{
    //     type: Object as PropType<Boxer>,
    //     required: true
    // }
    // },
    emits: ["submit"],
    data() {
        return {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            firstname: null as string | null,
            clubsAutoCompleteList: [] as string[],
        }
    },
    mounted() {
        this.clubsAutoCompleteList = store.getClubs()
    },
    methods: {
        checkForm() {},
    },
})
</script>
