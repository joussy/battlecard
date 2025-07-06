<template>
    <!-- Dynamic filter chips for active facets -->
    <template
        v-for="btn in facetButtons"
        :key="btn.facetKey"
    >
        <button
            v-if="btn.active"
            type="button"
            class="btn btn-outline-secondary btn-sm me-2 mb-1"
        >
            <a
                data-bs-toggle="offcanvas"
                data-bs-target="#filtersOffcanvasNavbar"
            >
                {{ btn.label }}:
                <template v-if="btn.displayValue !== undefined">
                    {{ btn.displayValue }}
                </template>
            </a>
            <i
                class="bi bi-x ms-1"
                aria-label="Remove"
                @click="clearFacet(btn.facetKey)"
            ></i>
        </button>
    </template>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useUiStore } from "@/stores/ui.store"
import { Facets } from "@/types/ui"

function displayRange(min: number | null | undefined, max: number | null | undefined) {
    const minDisplay = min !== null && min !== undefined ? min : "Any"
    const maxDisplay = max !== null && max !== undefined ? max : "Any"
    return `${minDisplay} - ${maxDisplay}`
}

export default defineComponent({
    name: "SearchFacetsComponent",
    data() {
        return {
            uiStore: useUiStore(),
        }
    },
    computed: {
        facets(): Facets | null {
            return this.uiStore.facets
        },
        facetButtons() {
            if (!this.facets) {
                return []
            }

            return [
                {
                    facetKey: "weight",
                    label: "Weight",
                    displayValue: displayRange(this.facets.filters.weight.min, this.facets.filters.weight.max),
                    active:
                        (this.facets.filters.weight.min !== null && this.facets.filters.weight.min !== undefined) ||
                        (this.facets.filters.weight.max !== null && this.facets.filters.weight.max !== undefined),
                },
                {
                    facetKey: "age",
                    label: "Age",
                    displayValue: displayRange(this.facets.filters.age.min, this.facets.filters.age.max),
                    active:
                        (this.facets.filters.age.min !== null && this.facets.filters.age.min !== undefined) ||
                        (this.facets.filters.age.max !== null && this.facets.filters.age.max !== undefined),
                },
                {
                    facetKey: "record",
                    label: "Victories",
                    displayValue: displayRange(this.facets.filters.nbFights.min, this.facets.filters.nbFights.max),
                    active:
                        (this.facets.filters.nbFights.min !== null && this.facets.filters.nbFights.min !== undefined) ||
                        (this.facets.filters.nbFights.max !== null && this.facets.filters.nbFights.max !== undefined),
                },
                {
                    facetKey: "gender",
                    label: "Gender",
                    displayValue: this.facets.filters.gender
                        ? this.facets.filters.gender.charAt(0).toUpperCase() + this.facets.filters.gender.slice(1)
                        : undefined,
                    active: !!this.facets.filters.gender,
                },
                {
                    facetKey: "sort",
                    label: "Sort",
                    displayValue: `${this.facets.sort.by} (${this.facets.sort.direction})`,
                    active: !!this.facets.sort.by,
                },
            ]
        },
    },
    methods: {
        clearFacet(facet: string) {
            this.uiStore.clearFacet(facet)
        },
    },
})
</script>
