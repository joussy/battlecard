<template>
    <span class="badge ms-1 text-bg-light">
        <Icon name="group-of-people" />
        {{ selected }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import IconComponent from "@/components/core/icon.component.vue"

export default defineComponent({
    components: {
        Icon: IconComponent,
    },
    props: {
        selected: {
            type: Number,
            required: true,
        },
    },
})
</script>
