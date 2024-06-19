<template>
    <span
        class="badge ms-2"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <img
            src="@/assets/icons/medal.svg"
            height="16"
        />
        {{ boxer.attributes.nbFights }}
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/types/modality"
import { PropType, defineComponent } from "vue"

export default defineComponent({
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
