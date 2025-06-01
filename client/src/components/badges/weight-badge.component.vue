<template>
    <span
        class="badge ms-1"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="scale" />
        {{ displayWeight() }}
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
            type: Object as PropType<ModalityError[] | null>,
            required: false,
            default: null,
        },
    },
    computed: {
        modalityError() {
            return this.modalityErrors?.some((error) => error.type == ModalityErrorType.WEIGHT)
        },
    },
    methods: {
        displayWeight() {
            const weight = this.boxer.weight
            return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(1)
        },
    },
})
</script>
