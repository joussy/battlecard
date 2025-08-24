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
        <IconComponent name="link" />
        <span class="number-text">{{ boxer.selectedFights }}</span>
    </span>
</template>

<script setup lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao } from "@/api"
import IconComponent from "@/components/shared/core/icon.component.vue"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})
</script>
