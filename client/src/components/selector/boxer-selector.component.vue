<template>
    <div class="max-width-md">
        <TournamentHeaderComponent />
        <div class="mb-3 d-flex gap-1">
            <div class="flex-grow-1"></div>

            <button
                class="btn btn-outline-success"
                type="button"
                @click="showAddBoxerOffcanvas = true"
            >
                <i class="bi bi-person-add" />
                <span class="d-none d-md-inline ms-2">{{ $t("selector.addBoxer") }}</span>
            </button>
            <button
                :disabled="boxersToDisplay.length == 0"
                type="button"
                class="btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i class="bi bi-download" />
                <span class="d-none d-md-inline ms-2">{{ $t("selector.export") }}</span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('battlecard')"
                    >
                        <i class="bi bi-file-earmark-spreadsheet" />
                        {{ $t("selector.exportFormats.csv") }}
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('xlsx')"
                    >
                        <i class="bi bi-file-earmark-spreadsheet" />
                        {{ $t("selector.exportFormats.xlsx") }}
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('png')"
                    >
                        <i class="bi bi-file-image" />
                        {{ $t("selector.exportFormats.png") }}
                    </a>
                    <a
                        class="dropdown-item"
                        @click="downloadFile('pdf')"
                    >
                        <i class="bi bi-file-earmark-pdf" />
                        {{ $t("selector.exportFormats.pdf") }}
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click="$router.push({ name: 'import' })"
                    >
                        <i class="bi bi-upload" />
                        {{ $t("selector.importBoxers") }}
                    </a>
                </li>
            </ul>
            <button
                class="btn btn-outline-secondary"
                @click="showFiltersOffcanvas = true"
            >
                <span class="bi bi-funnel"></span>
                {{ $t("selector.filters") }}
            </button>
            <BoxerSelectorFiltersComponent v-model="showFiltersOffcanvas" />
            <BoxerAddOffcanvasComponent
                v-model="showAddBoxerOffcanvas"
                @boxer-saved="onBoxerSaved"
            />
            <BoxerEditOffcanvasComponent
                v-model="showEditBoxerOffcanvas"
                @boxer-saved="onBoxerSaved"
            />
        </div>
        <div class="mb-2 row">
            <!-- Search bar -->
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    :placeholder="$t('selector.searchPlaceholder')"
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
            <SearchFacetsComponent @show-facets="showFiltersOffcanvas = true" />
        </div>
        <div
            v-for="boxer in boxersToDisplay"
            :key="boxer.id"
        >
            <BoxerTileComponent
                :boxer="boxer"
                :nb-opponents="boxer.eligibleFights"
                @edit-boxer="showEditBoxerOffcanvas = true"
            />
        </div>
        <div
            v-if="boxersToDisplay.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4">
                <div>{{ $t("selector.noBoxersFound") }}</div>
                <i>{{ $t("selector.adjustFilters") }}</i>
            </div>
            <div>
                <button
                    class="btn btn-outline-success"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#boxerAddOffcanvasNavbar"
                >
                    <i class="bi bi-person-add me-2"></i>{{ $t("selector.addNewBoxer") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { ExportOpenApi } from "@/api"
import BoxerTileComponent from "@/components/selector/boxer-tile.component.vue"
import BoxerAddOffcanvasComponent from "@/components/selector/add/boxer-add-offcanvas.component.vue"
import BoxerEditOffcanvasComponent from "@/components/selector/add/boxer-edit-offcanvas.component.vue"

import BoxerSelectorFiltersComponent from "@/components/selector/boxer-selector-filters.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import SearchFacetsComponent from "@/components/selector/search-facets.component.vue"
import Fuse from "fuse.js"
import { Boxer } from "@/types/boxing"
import { FileType } from "@/types/api"
import { getBoxerAge } from "@/utils/string.utils"
import TournamentHeaderComponent from "@/components/shared/layout/tournament-header.component.vue"
import { downloadWithDom } from "@/utils/download.utils"

const { t: $t } = useI18n()
const showAddBoxerOffcanvas = ref(false)
const showFiltersOffcanvas = ref(false)
const selectedTournamentId = ref<string | null>(null)
const tournamentStore = useTournamentStore()
const uiStore = useUiStore()
const boxersStore = useBoxerStore()
const showEditBoxerOffcanvas = ref(false)

const searchQuery = ref("")
const boxersToDisplay = ref<Boxer[]>([])
const searchTimeout = ref<number | null>(null)

watch(
    () => tournamentStore.currentTournamentId,
    async () => {
        selectedTournamentId.value = tournamentStore.currentTournamentId ?? null
        await boxersStore.fetchBoxers()
        setBoxersToDisplay()
    },
    { immediate: true }
)

watch(
    () => [searchQuery.value, uiStore.facets],
    () => {
        if (searchTimeout.value) {
            clearTimeout(searchTimeout.value)
        }
        searchTimeout.value = window.setTimeout(() => {
            setBoxersToDisplay()
        }, 300)
    },
    { deep: true }
)

function filterWithFacets(boxers: Boxer[]) {
    let filteredBoxers = boxers
    const facets = uiStore.facets
    filteredBoxers = boxers.filter((boxer) => {
        const filters = facets?.filters
        if (!filters) return true

        if (filters.weight.min !== null && boxer.weight < filters.weight.min) return false
        if (filters.weight.max !== null && boxer.weight > filters.weight.max) return false
        const age = getBoxerAge(boxer.birthDate)
        if (filters.age.min !== null && age < filters.age.min) return false
        if (filters.age.max !== null && age > filters.age.max) return false
        if (filters.nbFights.min !== null && age < filters.nbFights.min) return false
        if (filters.nbFights.max !== null && age > filters.nbFights.max) return false
        if (filters.gender && boxer.gender !== filters.gender) return false

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
}

function setBoxersToDisplay() {
    console.debug("Setting boxers to display with search query:", boxersStore.boxers)
    let filteredBoxers = filterWithFacets(boxersStore.boxers)
    if (!searchQuery.value) {
        boxersToDisplay.value = [...filteredBoxers]
        return
    }

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
    boxersToDisplay.value = [...fuse.search(searchQuery.value).map((result) => result.item)]
}

function clearSearch() {
    searchQuery.value = ""
}

async function downloadFile(fileType: FileType) {
    if (!tournamentStore.currentTournamentId) return

    const boxerIds = boxersToDisplay.value.map((boxer) => boxer.id)
    let res: Blob | File | undefined

    if (fileType === "xlsx") {
        res = await ExportOpenApi.getSelectorXlsx({
            body: {
                tournamentId: tournamentStore.currentTournamentId,
                boxerIds: boxerIds,
            },
        })
    }
    if (fileType === "battlecard") {
        res = await ExportOpenApi.getBattlecard({
            body: {
                tournamentId: tournamentStore.currentTournamentId,
                boxerIds: boxerIds,
            },
        })
    }
    if (fileType === "csv") {
        res = await ExportOpenApi.getSelectorCsv({
            body: {
                tournamentId: tournamentStore.currentTournamentId,
                boxerIds: boxerIds,
            },
        })
    }
    if (fileType === "png") {
        res = await ExportOpenApi.getSelectorPng({
            body: {
                tournamentId: tournamentStore.currentTournamentId,
                boxerIds: boxerIds,
            },
        })
    }
    if (fileType === "pdf") {
        res = await ExportOpenApi.getSelectorPdf({
            body: {
                tournamentId: tournamentStore.currentTournamentId,
                boxerIds: boxerIds,
            },
        })
    }
    downloadWithDom(res, `selector.${fileType}`)
}

async function onBoxerSaved() {
    await boxersStore.fetchBoxers()
    setBoxersToDisplay()
}
</script>
