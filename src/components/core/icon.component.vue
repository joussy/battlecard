<template>
    <component
        :is="icon"
        height="17"
        width="17"
    />
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue"

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        icon() {
            return defineAsyncComponent(() => import(`@/assets/icons/${this.name}.svg?component`))
        },
    },
}
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
