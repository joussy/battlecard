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
import { ModalityError } from "@/types/modality"
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
        modalityError: {
            type: Object as PropType<ModalityError>,
            required: false,
            default: null,
        },
    },
    methods: {
        displayWeight() {
            const weight = this.boxer.attributes.weight
            return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(1)
        },
    },
})
</script>
