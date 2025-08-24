<template>
    <span
        class="badge"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="birthday-cake" />
        <span class="number-text">{{ boxerAge }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao, ModalityErrorType } from "@/api"
import Icon from "@/components/shared/core/icon.component.vue"
import { getBoxerAge } from "@/utils/string.utils"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})

const modalityError = computed(() => {
    return props.modalityErrors?.some((error) => error.type == ModalityErrorType.AGE)
})

const boxerAge = computed(() => {
    return getBoxerAge(props.boxer.birthDate)
})
</script>
