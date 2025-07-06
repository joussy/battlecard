<template>
    <div
        v-if="facets?.filters"
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
            <!-- Weight Range -->
            <div class="mb-3">
                <label class="form-label">
                    <IconComponent
                        name="scale"
                        class="me-2"
                    />
                    Weight Range (kg)
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.weight.min"
                        type="number"
                        class="form-control me-2"
                        placeholder="Min"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.weight.max"
                        type="number"
                        class="form-control ms-2"
                        placeholder="Max"
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
                    Age Range
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.age.min"
                        type="number"
                        class="form-control me-2"
                        placeholder="Min"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.age.max"
                        type="number"
                        class="form-control ms-2"
                        placeholder="Max"
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
                    Number of Fights Range
                </label>
                <div class="d-flex align-items-center">
                    <input
                        v-model.number="facets.filters.nbFights.min"
                        type="number"
                        class="form-control me-2"
                        placeholder="Min"
                    />
                    <span class="mx-1">-</span>
                    <input
                        v-model.number="facets.filters.nbFights.max"
                        type="number"
                        class="form-control ms-2"
                        placeholder="Max"
                    />
                </div>
            </div>
            <hr />
            <!-- Gender -->
            <div class="mb-3">
                <label class="form-label">
                    <i class="bi bi-gender-ambiguous me-2"></i>
                    Gender
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
                            >Any</label
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
                            >Male</label
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
                            >Female</label
                        >
                    </div>
                </div>
            </div>
            <hr />
            <!-- Sort By -->
            <div class="mb-3">
                <label class="form-label">
                    <i class="bi bi-sort-alpha-down me-2"></i>
                    Sort By
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
                            >Name</label
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
                            >Weight</label
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
                            >Age</label
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
                            >Number of fights</label
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
                                Ascending
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
                                Descending
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUiStore } from "@/stores/ui.store"
import { defineComponent, toRaw } from "vue"
import IconComponent from "../core/icon.component.vue"

export default defineComponent({
    components: {
        IconComponent: IconComponent,
    },
    data() {
        return {
            facets: useUiStore().facets,
        }
    },
    watch: {
        sortRadio: {
            immediate: true,
            handler(val) {
                if (!val || !this.facets) return
                // Map radio value to facets.sort.by and direction
                this.facets.sort.by = val
                // Keep direction as selected
            },
        },
        facets: {
            deep: true,
            handler() {
                // console.debug("facets:", JSON.stringify(toRaw(this.facets), null, 2))
            },
        },
    },
})
</script>
