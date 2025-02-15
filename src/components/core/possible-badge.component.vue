<template>
    <span
        class="badge ms-2"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="glove" />
        {{ selected }}/{{ available }}
    </span>
</template>

<script lang="ts">
import { ModalityError } from "@/types/modality"
import { PropType, defineComponent } from "vue"
import IconComponent from "./icon.component.vue"

export default defineComponent({
    components: {
        Icon: IconComponent,
    },
    props: {
        selected: {
            type: Number,
            required: true,
        },
        available: {
            type: Number,
            required: true,
        },
        modalityError: {
            type: Object as PropType<ModalityError>,
            required: false,
            default: null,
        },
    },
})
</script>
