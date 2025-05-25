<template>
    <span
        class="badge ms-1"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="group-of-people" />
        {{ selected }}
    </span>
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
