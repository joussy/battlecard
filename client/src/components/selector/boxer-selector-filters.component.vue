<template>
    <div
        id="filtersOffcanvasNavbar"
        class="offcanvas offcanvas-end"
        tabindex="-1"
    >
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">Filters</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <div class="form-check form-switch mb-3">
                <input
                    id="hideNonMatchableOpponentsSwitch"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :checked="uiStore.hideNonMatchableOpponents"
                    @click="uiStore.hideNonMatchableOpponents = !uiStore.hideNonMatchableOpponents"
                />
                <label
                    class="form-check-label"
                    for="hideNonMatchableOpponentsSwitch"
                    >Hide non-matchable opponents</label
                >
            </div>
            <div class="form-check form-switch mb-3">
                <input
                    id="hideFightersWithNoMatchSwitch"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :checked="uiStore.hideFightersWithNoMatch"
                    @click="uiStore.hideFightersWithNoMatch = !uiStore.hideFightersWithNoMatch"
                />
                <label
                    class="form-check-label"
                    for="hideFightersWithNoMatchSwitch"
                    >Hide fighters with no matches</label
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUiStore } from "@/stores/ui.store"
import { defineComponent } from "vue"

export default defineComponent({
    data() {
        return {
            uiStore: useUiStore(),
        }
    },
})
</script>
