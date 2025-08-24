<template>
    <i
        class="bi"
        :class="iconClasses"
    ></i>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ModalityErrorDao } from "@/api"

interface Props {
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})

const iconClasses = computed((): string[] => {
    const isError = (props.modalityErrors?.length ?? 0) > 0
    if (isError) {
        return ["text-danger", "bi-x-circle-fill"]
    }
    return ["text-success", "bi-check-circle-fill"]
})
</script>
