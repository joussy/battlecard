<template>
    <span
        class="badge"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="medal" />
        <span class="number-text">{{ boxer.nbFights }}</span>
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError, ModalityErrorType } from "@/shared/types/modality.type"
import { PropType, defineComponent } from "vue"
import IconComponent from "@/components/core/icon.component.vue"

export default defineComponent({
    components: {
        Icon: IconComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
        modalityErrors: {
            type: Object as PropType<ModalityError[]>,
            required: false,
            default: [] as ModalityError[],
        },
    },
    computed: {
        modalityError(): boolean {
            return this.modalityErrors.some((error) => error.type === ModalityErrorType.PRIZE_LIST)
        },
    },
})
</script>
