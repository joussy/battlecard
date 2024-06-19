<template>
    <VForm @submit="checkForm">
        <div class="mb-3">
            <label
                for="lastname"
                class="form-label"
            >
                Last Name
            </label>
            <Field
                name="lastname"
                type="text"
                class="form-control"
                rules="required"
            />
            <ErrorMessage name="lastname" />
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
                name="firstname"
                type="text"
                class="form-control"
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
        <div class="mb-3 col-auto">
            <label
                for="weight"
                class="form-label"
            >
                Weight
            </label>
            <input
                id="weight"
                type="number"
                class="form-control"
            />
        </div>
        <div class="mb-3 col-auto">
            <label
                for="club"
                class="form-label"
            >
                Club
            </label>
            <input
                id="club"
                type="text"
                class="form-control"
            />
        </div>
        <div class="mb-3 col-auto">
            <label
                for="birthdate"
                class="form-label"
            >
                Date de naissance
            </label>
            <input
                id="birthdate"
                type="date"
                class="form-control"
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
import { defineRule } from "vee-validate"
import { required, email, min } from "@vee-validate/rules"
// defineRule("required", required)
// defineRule("email", email)
// defineRule("min", min)
defineRule("required", (value: string) => {
    if (!value || !value.length) {
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
        }
    },
    onCreated() {},
    methods: {
        checkForm() {
            // this.$emit("submit")
            console.log("checkform")
        },
    },
})
</script>
