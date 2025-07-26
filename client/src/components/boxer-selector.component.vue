<template>
    <div class="max-width-md">
        <div class="d-flex align-items-center mb-3">
            <div class="d-none d-xs-none d-sm-block">
                <div>
                    <i class="bi bi-calendar ms-2"></i>
                    {{ tournamentName }} - <i>{{ tournamentDate }}</i>
                </div>
            </div>
            <div class="flex-grow-1"></div>
            <button
                class="btn btn-outline-success ms-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#boxerAddOffcanvasNavbar"
            >
                <i class="bi bi-person-add" />
                <span class="d-none d-md-inline ms-2">Add Boxer</span>
            </button>
            <button
                :disabled="boxersToDisplay.length == 0"
                type="button"
                class="btn btn-outline-secondary ms-2 dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i class="bi bi-download" />
                <span class="d-none d-md-inline ms-2">Export</span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('battlecard')"
                    >
                        <i class="bi bi-file-earmark-spreadsheet" />
                        CSV
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('xlsx')"
                    >
                        <i class="bi bi-file-earmark-spreadsheet" />
                        XLSX
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('png')"
                    >
                        <i class="bi bi-file-image" />
                        PNG
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('pdf')"
                    >
                        <i class="bi bi-file-earmark-pdf" />
                        PDF
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click="$router.push({ name: 'import' })"
                    >
                        <i class="bi bi-upload" />
                        Import boxers
                    </a>
                </li>
            </ul>
            <button
                class="btn btn-outline-secondary ms-2"
                data-bs-toggle="offcanvas"
                data-bs-target="#filtersOffcanvasNavbar"
            >
                <span class="bi bi-funnel"></span>
                Filters
            </button>
            <BoxerSelectorFiltersComponent />
            <BoxerAddOffcanvasComponent @boxer-saved="onBoxerSaved" />
        </div>
        <div class="mb-2 row">
            <!-- Search bar -->
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="Type the name of a boxer ..."
                />
                <span
                    v-if="searchQuery"
                    class="input-group-text"
                    @click="clearSearch"
                    ><i class="bi bi-x-lg"></i
                ></span>
            </div>
        </div>
        <div class="mb-2">
            <SearchFacetsComponent />
        </div>
        <div
            v-for="boxer in boxersToDisplay"
            :key="boxer.id"
        >
            <BoxerTileComponent
                :boxer="boxer"
                :nb-opponents="boxer.eligibleFights"
                @click="$router.push({ name: 'selector-tile', params: { id: boxer.id } })"
            />
        </div>
        <div
            v-if="boxersToDisplay.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4">
                <div>It feels empty in here !</div>
                <i> You have no boxers matching your search criteria.</i>
            </div>
            <div>
                <button
                    class="btn btn-outline-success"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#boxerAddOffcanvasNavbar"
                >
                    <i class="bi bi-person-add me-2"></i>Import or create a boxer
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue"
import { Gender, ModalityErrorType } from "@/shared/types/modality.type"
import BoxerTileComponent from "@/components/selector/boxer-tile.component.vue"
import BoxerAddOffcanvasComponent from "@/components/selector/add/boxer-add-offcanvas.component.vue"

import BoxerSelectorFiltersComponent from "@/components/selector/boxer-selector-filters.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import SearchFacetsComponent from "@/components/selector/search-facets.component.vue"
import Fuse from "fuse.js"
import { Boxer } from "@/types/boxing"
import { differenceInYears } from "date-fns"
import { FileType } from "@/types/api"
import exportManager from "@/managers/export.manager"

export default defineComponent({
    components: {
        BoxerTileComponent: BoxerTileComponent,
        BoxerAddOffcanvasComponent: BoxerAddOffcanvasComponent,
        BoxerSelectorFiltersComponent: BoxerSelectorFiltersComponent,
        SearchFacetsComponent: SearchFacetsComponent,
    },
    data() {
        return {
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            selectedTournamentId: null as string | null,
            tournamentStore: useTournamentStore(),
            tournamentBoxerStore: useTournamentBoxerStore(),
            uiStore: useUiStore(),
            boxersStore: useBoxerStore(),
            facets: useUiStore().facets,
            searchQuery: "", // Added for search bar binding
            boxersToDisplay: [] as Boxer[],
            searchTimeout: null as number | null,
        }
    },
    computed: {
        tournamentName() {
            return this.tournamentStore.getCurrentTournament()?.name
        },
        tournamentDate() {
            const dateAsStr = this.tournamentStore.getCurrentTournament()?.date
            if (!dateAsStr) return null
            const date = new Date(dateAsStr)
            return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : null
        },
        nbBoxers() {
            return this.boxersToDisplay.length
        },
    },
    mounted() {
        watch(
            () => [this.tournamentStore.currentTournamentId],
            async () => {
                this.selectedTournamentId = this.tournamentStore.currentTournamentId ?? null
                await this.boxersStore.fetchBoxers()
                this.setBoxersToDisplay()
            },
            { immediate: true }
        )
        watch(
            () => [this.searchQuery, this.uiStore.facets],
            () => {
                // Clear existing timeout
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout)
                }
                // Set new timeout
                this.searchTimeout = setTimeout(() => {
                    this.setBoxersToDisplay()
                }, 300) as unknown as number
            },
            { deep: true }
        )
    },
    methods: {
        filterWithFacets(boxers: Boxer[]) {
            let filteredBoxers = boxers
            const facets = this.uiStore.facets
            filteredBoxers = boxers.filter((boxer) => {
                const filters = facets?.filters
                if (!filters) return true // If no filters, return all boxers

                if (filters.weight.min !== null && boxer.weight < filters.weight.min) return false
                if (filters.weight.max !== null && boxer.weight > filters.weight.max) return false
                const age = differenceInYears(new Date(), boxer.birthDate)
                if (filters.age.min !== null && age < filters.age.min) return false
                if (filters.age.max !== null && age > filters.age.max) return false
                if (filters.nbFights.min !== null && age < filters.nbFights.min) return false
                if (filters.nbFights.max !== null && age > filters.nbFights.max) return false
                if (filters.gender && boxer.gender !== filters.gender) return false

                // If all filters pass, return true
                return true
            })
            if (facets?.sort) {
                const { by } = facets.sort
                if (by === "name") {
                    filteredBoxers.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
                        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
                        return nameA.localeCompare(nameB)
                    })
                } else if (by === "weight") {
                    filteredBoxers.sort((a, b) => a.weight - b.weight)
                } else if (by === "age") {
                    filteredBoxers.sort((a, b) => {
                        return b.birthDate.getTime() - a.birthDate.getTime()
                    })
                } else if (by === "nbFights") {
                    filteredBoxers.sort((a, b) => a.nbFights - b.nbFights)
                }
                if (facets.sort.direction === "desc") {
                    filteredBoxers.reverse()
                }

                return filteredBoxers
            }

            return filteredBoxers
        },
        setBoxersToDisplay() {
            console.debug("Setting boxers to display with search query:", this.boxersStore.boxers)
            // 1. Filter by facets first
            let filteredBoxers = this.filterWithFacets(this.boxersStore.boxers)
            if (!this.searchQuery) {
                this.boxersToDisplay = [...filteredBoxers]
                return
            }

            // 2. Then filter by search query using Fuse.js
            const boxersWithFullName = filteredBoxers.map((boxer) => ({
                ...boxer,
                fullName: `${boxer.firstName} ${boxer.lastName}`,
            }))
            const fuse = new Fuse(boxersWithFullName, {
                keys: [
                    { name: "firstName", weight: 0.4 },
                    { name: "lastName", weight: 0.4 },
                    { name: "fullName", weight: 1.0 },
                ],
                threshold: 0.3,
                ignoreLocation: true,
                distance: 100,
            })
            this.boxersToDisplay = [...fuse.search(this.searchQuery).map((result) => result.item)]
        },
        clearSearch() {
            this.searchQuery = ""
        },
        async downloadFile(fileType: FileType) {
            if (!this.tournamentStore.currentTournamentId) {
                return
            }

            const boxerIds = this.boxersToDisplay.map((boxer) => boxer.id)

            if (fileType === "xlsx") {
                await exportManager.downloadSelectorXlsx(this.tournamentStore.currentTournamentId, boxerIds)
            }
            if (fileType === "battlecard") {
                await exportManager.downloadSelectorBattlecard(this.tournamentStore.currentTournamentId, boxerIds)
            }
            if (fileType === "csv") {
                await exportManager.downloadSelectorCsv(this.tournamentStore.currentTournamentId, boxerIds)
            }
            if (fileType === "png") {
                await exportManager.downloadSelectorPng(this.tournamentStore.currentTournamentId, boxerIds)
            }
            if (fileType === "pdf") {
                await exportManager.downloadSelectorPdf(this.tournamentStore.currentTournamentId, boxerIds)
            }
        },
        async onBoxerSaved() {
            // Refresh the boxers list after a boxer is saved
            await this.boxersStore.fetchBoxers()
            this.setBoxersToDisplay()
        },
        onFacetUpdated() {
            this.setBoxersToDisplay()
        },
    },
})
</script>
