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

<script setup lang="ts">
import { computed } from "vue"
import { useUiStore } from "@/stores/ui.store"
import { Facets } from "@/types/ui"

function displayRange(min: number | null | undefined, max: number | null | undefined) {
    const minDisplay = min !== null && min !== undefined ? min : "Any"
    const maxDisplay = max !== null && max !== undefined ? max : "Any"
    return `${minDisplay} - ${maxDisplay}`
}

const uiStore = useUiStore()

const facets = computed((): Facets | null => {
    return uiStore.facets
})

const facetButtons = computed(() => {
    if (!facets.value) {
        return []
    }

    return [
        {
            facetKey: "weight",
            label: "Weight",
            displayValue: displayRange(facets.value.filters.weight.min, facets.value.filters.weight.max),
            active:
                (facets.value.filters.weight.min !== null && facets.value.filters.weight.min !== undefined) ||
                (facets.value.filters.weight.max !== null && facets.value.filters.weight.max !== undefined),
        },
        {
            facetKey: "age",
            label: "Age",
            displayValue: displayRange(facets.value.filters.age.min, facets.value.filters.age.max),
            active:
                (facets.value.filters.age.min !== null && facets.value.filters.age.min !== undefined) ||
                (facets.value.filters.age.max !== null && facets.value.filters.age.max !== undefined),
        },
        {
            facetKey: "record",
            label: "Victories",
            displayValue: displayRange(facets.value.filters.nbFights.min, facets.value.filters.nbFights.max),
            active:
                (facets.value.filters.nbFights.min !== null && facets.value.filters.nbFights.min !== undefined) ||
                (facets.value.filters.nbFights.max !== null && facets.value.filters.nbFights.max !== undefined),
        },
        {
            facetKey: "gender",
            label: "Gender",
            displayValue: facets.value.filters.gender
                ? facets.value.filters.gender.charAt(0).toUpperCase() + facets.value.filters.gender.slice(1)
                : undefined,
            active: !!facets.value.filters.gender,
        },
        {
            facetKey: "sort",
            label: "Sort",
            displayValue: `${facets.value.sort.by} (${facets.value.sort.direction})`,
            active: !!facets.value.sort.by,
        },
    ]
})

const clearFacet = (facet: string) => {
    uiStore.clearFacet(facet)
}
</script>
