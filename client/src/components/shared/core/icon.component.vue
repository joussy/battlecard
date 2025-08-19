<template>
    <component
        :is="icon"
        :class="'svg-' + size"
    />
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue"

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    computed: {
        icon() {
            return defineAsyncComponent(() => import(`@/assets/icons/${this.name}.svg?component`))
        },
    },
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
