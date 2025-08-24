<template>
    <span class="badge text-bg-light">
        <IconComponent name="group-of-people" />
        <span class="number-text">{{ selected }}</span>
    </span>
</template>

<script setup lang="ts">
import IconComponent from "@/components/shared/core/icon.component.vue"

interface Props {
    selected: number
}

defineProps<Props>()
</script>
