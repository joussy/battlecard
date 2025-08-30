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
            <a @click="emit('show-facets')">
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
import { useI18n } from "vue-i18n"
import { useUiStore } from "@/stores/ui.store"
import { Facets } from "@/types/ui"

const { t: $t } = useI18n()

function displayRange(min: number | null | undefined, max: number | null | undefined) {
    const minDisplay = min !== null && min !== undefined ? min : $t("selector.all")
    const maxDisplay = max !== null && max !== undefined ? max : $t("selector.all")
    return `${minDisplay} - ${maxDisplay}`
}

const uiStore = useUiStore()
const emit = defineEmits<{
    (e: "show-facets"): void
}>()

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
            label: $t("selector.weight"),
            displayValue: displayRange(facets.value.filters.weight.min, facets.value.filters.weight.max),
            active:
                (facets.value.filters.weight.min !== null && facets.value.filters.weight.min !== undefined) ||
                (facets.value.filters.weight.max !== null && facets.value.filters.weight.max !== undefined),
        },
        {
            facetKey: "age",
            label: $t("selector.age"),
            displayValue: displayRange(facets.value.filters.age.min, facets.value.filters.age.max),
            active:
                (facets.value.filters.age.min !== null && facets.value.filters.age.min !== undefined) ||
                (facets.value.filters.age.max !== null && facets.value.filters.age.max !== undefined),
        },
        {
            facetKey: "record",
            label: $t("import.fights"),
            displayValue: displayRange(facets.value.filters.nbFights.min, facets.value.filters.nbFights.max),
            active:
                (facets.value.filters.nbFights.min !== null && facets.value.filters.nbFights.min !== undefined) ||
                (facets.value.filters.nbFights.max !== null && facets.value.filters.nbFights.max !== undefined),
        },
        {
            facetKey: "gender",
            label: $t("selector.genderFilter"),
            displayValue: facets.value.filters.gender
                ? facets.value.filters.gender.charAt(0).toUpperCase() + facets.value.filters.gender.slice(1)
                : undefined,
            active: !!facets.value.filters.gender,
        },
        {
            facetKey: "sort",
            label: $t("selector.sortBy"),
            displayValue: `${facets.value.sort.by} (${facets.value.sort.direction})`,
            active: !!facets.value.sort.by,
        },
    ]
})

const clearFacet = (facet: string) => {
    uiStore.clearFacet(facet)
}
</script>
