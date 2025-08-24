<template>
    <div
        v-if="facets?.filters"
        id="filtersOffcanvasNavbar"
        class="offcanvas offcanvas-end"
        tabindex="-1"
    >
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">
                <i class="bi bi-funnel me-1"></i>
                {{ $t("selector.filters") }}
            </h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <!-- Weight Range -->
            <div class="mb-3">
                <label class="form-label">
                    <IconComponent
                        name="scale"
                        class="me-2"
                    />
                    {{ $t("selector.weightRange") }}
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.weight.min"
                        type="number"
                        class="form-control me-2"
                        :placeholder="$t('selector.min')"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.weight.max"
                        type="number"
                        class="form-control ms-2"
                        :placeholder="$t('selector.max')"
                    />
                </div>
            </div>
            <hr />
            <!-- Age Range -->
            <div class="mb-3">
                <label class="form-label">
                    <IconComponent
                        name="birthday-cake"
                        class="me-2"
                    />
                    {{ $t("selector.ageRange") }}
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.age.min"
                        type="number"
                        class="form-control me-2"
                        :placeholder="$t('selector.min')"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.age.max"
                        type="number"
                        class="form-control ms-2"
                        :placeholder="$t('selector.max')"
                    />
                </div>
            </div>
            <hr />
            <!-- Victories Range -->
            <div class="mb-3">
                <label class="form-label">
                    <IconComponent
                        name="medal"
                        class="me-2"
                    />
                    {{ $t("selector.fightsRange") }}
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.nbFights.min"
                        type="number"
                        class="form-control me-2"
                        :placeholder="$t('selector.min')"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.nbFights.max"
                        type="number"
                        class="form-control ms-2"
                        :placeholder="$t('selector.max')"
                    />
                </div>
            </div>
            <hr />
            <!-- Gender -->
            <div class="mb-3">
                <label class="form-label">
                    <i class="bi bi-gender-ambiguous me-2"></i>
                    {{ $t("selector.genderFilter") }}
                </label>
                <div>
                    <div class="form-check form-check-inline">
                        <input
                            id="genderAny"
                            v-model="facets.filters.gender"
                            class="form-check-input"
                            type="radio"
                            name="gender"
                            value=""
                        />
                        <label
                            class="form-check-label"
                            for="genderAny"
                            >{{ $t("selector.all") }}</label
                        >
                    </div>
                    <div class="form-check form-check-inline">
                        <input
                            id="genderMale"
                            v-model="facets.filters.gender"
                            class="form-check-input"
                            type="radio"
                            name="gender"
                            value="male"
                        />
                        <label
                            class="form-check-label"
                            for="genderMale"
                            >{{ $t("selector.male") }}</label
                        >
                    </div>
                    <div class="form-check form-check-inline">
                        <input
                            id="genderFemale"
                            v-model="facets.filters.gender"
                            class="form-check-input"
                            type="radio"
                            name="gender"
                            value="female"
                        />
                        <label
                            class="form-check-label"
                            for="genderFemale"
                            >{{ $t("selector.female") }}</label
                        >
                    </div>
                </div>
            </div>
            <hr />
            <!-- Sort By -->
            <div class="mb-3">
                <label class="form-label">
                    <i class="bi bi-sort-alpha-down me-2"></i>
                    {{ $t("selector.sortBy") }}
                </label>
                <div>
                    <div class="form-check">
                        <input
                            id="sortNameAsc"
                            v-model="facets.sort.by"
                            class="form-check-input"
                            type="radio"
                            name="sortBy"
                            value="name"
                        />
                        <label
                            class="form-check-label"
                            for="sortNameAsc"
                            >{{ $t("selector.name") }}</label
                        >
                    </div>
                    <div class="form-check">
                        <input
                            id="sortWeight"
                            v-model="facets.sort.by"
                            class="form-check-input"
                            type="radio"
                            name="sortBy"
                            value="weight"
                        />
                        <label
                            class="form-check-label"
                            for="sortWeight"
                            >{{ $t("selector.weight") }}</label
                        >
                    </div>
                    <div class="form-check">
                        <input
                            id="sortAge"
                            v-model="facets.sort.by"
                            class="form-check-input"
                            type="radio"
                            name="sortBy"
                            value="age"
                        />
                        <label
                            class="form-check-label"
                            for="sortAge"
                            >{{ $t("selector.age") }}</label
                        >
                    </div>
                    <div class="form-check">
                        <input
                            id="sortNbFights"
                            v-model="facets.sort.by"
                            class="form-check-input"
                            type="radio"
                            name="sortBy"
                            value="nbFights"
                        />
                        <label
                            class="form-check-label"
                            for="sortNbFights"
                            >{{ $t("import.fights") }}</label
                        >
                    </div>
                    <!-- Direction toggle -->
                    <div class="mt-2">
                        <div
                            class="btn-group"
                            role="group"
                            aria-label="Sort direction"
                        >
                            <input
                                id="sortAsc"
                                v-model="facets.sort.direction"
                                type="radio"
                                class="btn-check"
                                name="sortDirection"
                                value="asc"
                            />
                            <label
                                class="btn btn-outline-primary btn-sm"
                                for="sortAsc"
                            >
                                <i class="bi bi-sort-alpha-down"></i>
                                {{ $t("selector.ascending") }}
                            </label>
                            <input
                                id="sortDesc"
                                v-model="facets.sort.direction"
                                type="radio"
                                class="btn-check"
                                name="sortDirection"
                                value="desc"
                            />
                            <label
                                class="btn btn-outline-primary btn-sm"
                                for="sortDesc"
                            >
                                <i class="bi bi-sort-alpha-up"></i>
                                {{ $t("selector.descending") }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useI18n } from "vue-i18n"
import { useUiStore } from "@/stores/ui.store"
import IconComponent from "@/components/shared/core/icon.component.vue"

const { t: $t } = useI18n()

const emit = defineEmits<{ (e: "updateFacets"): void }>()

const facets = useUiStore().facets

// Emit updateFacets whenever facets change (deep watch)
watch(
    () => facets,
    () => {
        emit("updateFacets")
    },
    { deep: true }
)
</script>
