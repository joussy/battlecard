<template>
    <Offcanvas
        id="mainMenu"
        ref="menu"
        title="Main Menu"
        placement="end"
        :v-model:show="show"
        @update:show="$emit('update:show', $event)"
    >
        <p>Reusable offcanvas content here</p>
    </Offcanvas>
</template>

<script lang="ts">
import Offcanvas from "@/components/core/offcanvas.component.vue"

export default {
    components: { Offcanvas },
    emits: ["update:show"],
    data() {
        return {
            show: false as boolean,
        }
    },
}
</script>
