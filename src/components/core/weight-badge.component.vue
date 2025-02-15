<template>
    <span
        class="badge ms-2"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="scale" />
        {{ boxer.attributes.weight }}
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/types/modality"
import { PropType, defineComponent } from "vue"
import IconComponent from "./icon.component.vue"

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
})
</script>
