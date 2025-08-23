<template>
    <i
        class="bi"
        :class="iconClasses"
    ></i>
</template>

<script lang="ts">
import { ModalityErrorDao } from "@/api"
import { PropType, defineComponent } from "vue"

export default defineComponent({
    components: {},
    props: {
        modalityErrors: {
            type: Object as PropType<ModalityErrorDao[] | null>,
            required: false,
            default: null,
        },
    },
    computed: {
        iconClasses(): string[] {
            const isError = this.modalityErrors?.length ?? 0 > 0
            if (isError) {
                return ["text-danger", "bi-x-circle-fill"]
            }
            return ["text-success", "bi-check-circle-fill"]
        },
    },
})
</script>
