<template>
    <div
        id="offcanvasNavbar"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        aria-labelledby="offcanvasNavbarLabel"
    >
        <div class="offcanvas-header">
            <h5
                id="offcanvasNavbarLabel"
                class="offcanvas-title"
            >
                Filters
            </h5>
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
                    :checked="store.hideNonMatchableOpponents"
                    @click="store.hideNonMatchableOpponents = !store.hideNonMatchableOpponents"
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
                    :checked="store.hideFightersWithNoMatch"
                    @click="store.hideFightersWithNoMatch = !store.hideFightersWithNoMatch"
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
import { defineComponent } from "vue"

import { store } from "@/composables/fight.composable"

export default defineComponent({
    data() {
        return {
            store,
        }
    },
})
</script>
