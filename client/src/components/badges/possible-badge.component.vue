<template>
    <span class="badge ms-1">
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
