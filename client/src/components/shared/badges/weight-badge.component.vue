<template>
    <span
        class="badge"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <IconComponent name="scale" />
        <span class="ms-1 number-text">{{ displayWeight }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao, ModalityErrorType } from "@/api"
import IconComponent from "@/components/shared/core/icon.component.vue"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})

const modalityError = computed(() => {
    return props.modalityErrors?.some((error) => error.type == ModalityErrorType.WEIGHT)
})

const displayWeight = computed(() => {
    const weight = props.boxer.weight
    return weight % 1 === 0 ? weight.toFixed(0) : weight.toFixed(1)
})
</script>
