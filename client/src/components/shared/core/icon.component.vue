<template>
    <component
        :is="icon"
        :class="'svg-' + size"
    />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue"

interface Props {
    name: string
    size?: number
}

const props = withDefaults(defineProps<Props>(), {
    size: 1,
})

const icon = computed(() => {
    return defineAsyncComponent(() => import(`@/assets/icons/${props.name}.svg?component`))
})
</script>
<style lang="scss">
.svg-1 {
    width: auto;
    height: 17px;
}

.svg-2 {
    width: auto;
    height: 2 * 17px;
}

.svg-3 {
    width: auto;
    height: 3 * 17px;
}
</style>
