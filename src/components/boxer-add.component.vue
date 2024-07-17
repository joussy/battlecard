<template>
    <VForm
        class=""
        @submit="submitForm"
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
                value="lastnametest"
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
                value="firstnametest"
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
        <div class="mb-3 is-invalid">
            <!-- <Field
                id="none"
                value="female"
                name="btnradio"
                type="radio"
                class=""
                rules="genderRequired"
            /> -->
            <div
                class="btn-group"
                role="group"
            >
                <Field
                    id="male"
                    :value="Gender.MALE"
                    name="gender"
                    type="radio"
                    class="btn-check"
                    rules="genderRequired"
                />
                <label
                    class="btn btn-outline-primary"
                    for="male"
                >
                    Male
                </label>
                <Field
                    id="female"
                    :value="Gender.FEMALE"
                    type="radio"
                    class="btn-check"
                    name="gender"
                    rules="genderRequired"
                />
                <label
                    class="btn btn-outline-primary"
                    for="female"
                >
                    Female
                </label>
                <ErrorMessage
                    name="gender"
                    class="invalid-feedback"
                />
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
                value="123"
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
                value="club13"
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
                value="2000-12-11"
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
import { Form, Field, ErrorMessage, GenericObject } from "vee-validate"

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
defineRule("genderRequired", (value: string) => {
    if (!value || value == "none") {
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
        submitForm(f: GenericObject) {
            this.$emit("submit", f)
        },
    },
})
</script>
