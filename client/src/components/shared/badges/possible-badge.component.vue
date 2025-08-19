<template>
    <span class="badge text-bg-light">
        <Icon name="group-of-people" />
        <span class="number-text">{{ selected }}</span>
    </span>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import IconComponent from "@/components/shared/core/icon.component.vue"

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
