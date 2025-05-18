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
                Add a new event
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
                        Name
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
                <button
                    type="submit"
                    class="btn btn-primary"
                >
                    Create
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { configure, defineRule, GenericObject, useForm } from "vee-validate"
import { Tournament } from "@/types/boxing.d"
import fightService from "@/services/fight.service"
import { generateRandomId } from "@/utils/string.utils"
import { closeModal } from "@/utils/ui.utils"
import { userStore } from "@/composables/user.composable"

configure({
    validateOnInput: true,
})
defineRule("required", (value: string) => {
    if (!value || !value.length) {
        return "This field is required"
    }
    return true
})

export default defineComponent({
    components: {},
    setup() {
        // Create the form
        const { defineField, handleSubmit, errors, resetForm } = useForm({
            validationSchema: {
                name: "required",
            },
            initialValues: {
                name: "",
            },
        })

        // Define fields
        const [name] = defineField("name")
        const onSubmit = handleSubmit(async (form: GenericObject) => {
            if (!userStore.account) return
            const tournament: Tournament = {
                name: form.name,
                id: generateRandomId(),
                userId: userStore.account?.id,
            }
            await fightService.addTournament(tournament)
            resetForm()
            closeModal("#tournamentAddOffcanvasNavbar")
            // emit("boxer-add", tournament)
        })
        return {
            onSubmit,
            errors,
            name,
        }
    },
    data() {
        return {}
    },
})
</script>
