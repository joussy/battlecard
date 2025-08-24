<template>
    <span
        class="badge"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="medal" />
        <span class="number-text">{{ boxer.nbFights }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Boxer } from "@/types/boxing"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { ModalityErrorDao, ModalityErrorType } from "@/api"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: () => [] as ModalityErrorDao[],
})

const modalityError = computed((): boolean => {
    return props.modalityErrors?.some((error) => error.type === ModalityErrorType.PRIZE_LIST) ?? false
})
</script>
