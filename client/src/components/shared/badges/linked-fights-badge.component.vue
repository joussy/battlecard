<template>
    <span
        v-if="boxer.selectedFights"
        class="badge"
        :class="{
            'text-bg-success': boxer.selectedFights < 2,
            'text-bg-warning': boxer.selectedFights == 2,
            'text-bg-danger': boxer.selectedFights > 2,
            invisible: boxer.selectedFights < 1,
        }"
    >
        <Icon name="link" />
        <span class="number-text">{{ boxer.selectedFights }}</span>
    </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"

import { Boxer } from "@/types/boxing"
import { ModalityErrorDao } from "@/api"
import IconComponent from "@/components/shared/core/icon.component.vue"
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
        modalityErrors: {
            type: Object as PropType<ModalityErrorDao[]>,
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
