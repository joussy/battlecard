<template>
    <span
        class="badge ms-1"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="medal" />
        {{ boxer.attributes.nbFights }}
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
            type: Object as PropType<ModalityError | null>,
            required: false,
            default: null,
        },
    },
})
</script>
