<template>
    <span class="badge text-bg-light">
        <i
            class="bi bi-badge"
            :class="iconClass()"
        ></i>
    </span>
</template>

<script setup lang="ts">
interface Props {
    eligibleOpponents: number
}

const props = defineProps<Props>()
const iconClass = function (): string {
    //if no fight, if one fight, if more than one fight
    if (props.eligibleOpponents === 0) {
        return "bi-reception-0 text-danger"
    } else if (props.eligibleOpponents === 1) {
        return "bi-reception-3"
    } else {
        return "bi-reception-4 text-success"
    }
}
</script>
