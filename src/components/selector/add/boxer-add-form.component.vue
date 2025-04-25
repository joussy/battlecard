<template>
    <form
        class=""
        @submit="onSubmit"
    >
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
                    :value="Gender[Gender.FEMALE]"
                />
                <label
                    class="btn btn-outline-primary"
                    for="gender_1"
                    >Female</label
                >

                <input
                    id="gender_2"
                    v-model="gender"
                    type="radio"
                    class="btn-check"
                    name="gender"
                    autocomplete="off"
                    :value="Gender[Gender.MALE]"
                />
                <label
                    class="btn btn-outline-primary"
                    for="gender_2"
                    >Male</label
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
                Birth Date
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
                Weight
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
                Club
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
                    :value="clubName"
                ></option>
            </datalist>
            <span
                name="club"
                class="invalid-feedback"
                >{{ errors.club }}</span
            >
        </div>
        <div class="mb-3">
            <label
                for="license"
                class="form-label"
            >
                License
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
        <button
            type="submit"
            class="btn btn-primary"
        >
            Submit
        </button>
    </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"

import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { BoxerAttributes, Gender } from "@/types/boxing.d"
import fightService from "@/services/fight.service"
import { generateRandomId } from "@/utils/string.utils"

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

    // Normalize and parse
    const normalized = value.replace(",", ".")
    const parsed = parseFloat(normalized)

    if (isNaN(parsed) || parsed < 1) {
        return "The number must be greater than or equal to 1"
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
    components: {},
    props: {
        boxer: {
            type: Object as PropType<BoxerAttributes | null>,
            required: false,
            default: null,
        },
    },
    emits: ["boxer-add"],
    setup(_, { emit }) {
        // Create the form
        const { defineField, handleSubmit, errors } = useForm({
            validationSchema: {
                lastname: "required",
                firstname: "required",
                weight: "weightRequired",
                license: "required",
                club: "required",
                gender: "genderRequired",
                birthdate: "required",
            },
            initialValues: {
                lastname: "lastnametest",
                firstname: "firstnametest",
                weight: "123",
                license: "licensetest",
                club: "clubtest",
                birthdate: "1990-09-21",
                gender: Gender[Gender.FEMALE],
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
        const onSubmit = handleSubmit(async (form: GenericObject) => {
            const boxerAttributes: BoxerAttributes = {
                birthDate: new Date(form.birthdate),
                club: form.club,
                firstName: form.firstname,
                lastName: form.lastname,
                gender: form.gender == Gender[Gender.FEMALE] ? Gender.FEMALE : Gender.MALE,
                weight: parseInt(form.weight),
                category: "",
                categoryShortText: "",
                license: form.license,
                nbFights: 0,
                id: generateRandomId(),
            }
            await fightService.addBoxer(boxerAttributes)

            if (boxerAttributes.id != "")
            {
                emit("boxer-add", boxerAttributes)
            }
        })
        return {
            onSubmit,
            lastname,
            errors,
            firstname,
            weight,
            license,
            club,
            gender,
            birthdate,
            clubsAutoCompleteList: [] as string[],
            Gender,
        }
    },
    mounted() {
        this.clubsAutoCompleteList = fightService.getClubs()
    },
})
</script>
