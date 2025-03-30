<template>
    <component
        :is="icon"
        :height="height"
        :width="width"
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
        height: {
            type: String,
            required: false,
            default: "17",
        },
        width: {
            type: String,
            required: false,
            default: "17",
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
.svg-2 {
    width: 2 * 17px;
    height: 2 * 17px;
}

.svg-3 {
    width: 3 * 17px;
    height: 3 * 17px;
}
</style>
