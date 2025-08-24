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

<script setup lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao } from "@/api"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useBoxerStore } from "@/stores/boxer.store"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})

const boxerStore = useBoxerStore()
</script>
