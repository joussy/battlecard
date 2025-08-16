<template>
    <i
        class="bi"
        :class="iconClasses"
    ></i>
</template>

<script lang="ts">
import { ModalityError } from "@/shared/types/modality.type"
import { PropType, defineComponent } from "vue"
import IconComponent from "@/components/core/icon.component.vue"

export default defineComponent({
    components: {
        Icon: IconComponent,
    },
    props: {
        modalityErrors: {
            type: Object as PropType<ModalityError[] | null>,
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
