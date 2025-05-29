<template>
    <span
        v-if="boxer.selectedFights"
        class="badge ms-1"
        :class="{
            'text-bg-success': boxer.selectedFights < 2,
            'text-bg-warning': boxer.selectedFights == 2,
            'text-bg-danger': boxer.selectedFights > 2,
            invisible: boxer.selectedFights < 1,
        }"
    >
        <Icon name="link" />
        {{ boxer.selectedFights }}
    </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"

import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/shared/types/modality.type"
import IconComponent from "@/components/core/icon.component.vue"
import { useBoxerStore } from "@/stores/boxer.store"

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
    data() {
        return {
            boxerStore: useBoxerStore(),
        }
    },
})
</script>
