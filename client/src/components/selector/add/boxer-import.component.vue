<template>
    <div class="justify-content-center m-4 text-center">
        <div class="mb-4"><i>Many boxers to import ?</i></div>
        <div class="mb-4"><i>Import them using your favorite format !</i></div>
        <div>
            <button
                class="btn btn-outline-success"
                @click="$router.push({ name: 'import' })"
            >
                <i class="bi bi-person-add me-2"></i>Import boxers
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import IconComponent from "@/components/core/icon.component.vue"
import { useUiStore } from "@/stores/ui.store"

export default defineComponent({
    components: {
        IconComponent,
    },
    data() {},
    methods: {},
})
</script>
