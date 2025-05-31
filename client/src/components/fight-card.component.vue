<template>
    <div :class="{ 'edition-mode': editionMode }">
        <div class="d-flex menu-card-tools">
            <div class="flex-grow-1"></div>
            <button
                type="button"
                class="btn btn-outline-success mb-3 ms-2"
                :class="{ active: editionMode }"
                :disabled="getNbFights() == 0 && !editionMode"
                @click="editionMode = !editionMode"
            >
                <i class="bi bi-pencil" />
            </button>
            <div
                v-if="uiStore.account != null"
                class="btn-group"
                role="group"
            >
                <button
                    type="button"
                    class="btn btn-outline-secondary mb-3 ms-2 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i class="bi bi-download" />
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('pdf')"
                        >
                            <i class="bi bi-file-earmark-pdf"></i>
                            PDF
                        </a>
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('xlsx')"
                        >
                            <i class="bi bi-file-earmark-spreadsheet"></i>
                            XLSX</a
                        >
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('csv')"
                        >
                            <i class="bi bi-file-earmark-spreadsheet"></i>
                            CSV</a
                        >
                    </li>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="downloadFile('png')"
                        >
                            <i class="bi bi-file-earmark-image-fill"></i>
                            PNG</a
                        >
                    </li>
                </ul>
                <div
                    v-if="editionMode"
                    id="editModeToast"
                    class="d-md-none toast show bg-success text-white position-fixed top-0 start-50 translate-middle-x mt-3"
                    role="alert"
                >
                    <div
                        class="toast-body text-center"
                        @click="editionMode = false"
                    >
                        I'm Done editing
                    </div>
                </div>
            </div>
        </div>
        <div class="border border-light-subtle rounded-3 p-1">
            <table
                v-if="getNbFights() > 0"
                ref="sortableTable"
                class="table table-striped table-borderless mb-0"
            >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th
                            class="cell-red"
                            scope="col"
                        >
                            Red
                        </th>
                        <th
                            scope="col"
                            class="cell-blue"
                        >
                            Blue
                        </th>
                        <th
                            class="fight-extra-infos"
                            scope="col"
                        />
                        <th
                            v-if="editionMode"
                            scope="col"
                        />
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr
                        v-for="fight in fightCard"
                        :key="fight.id"
                    >
                        <th
                            scope="row"
                            :class="{ handle: editionMode }"
                        >
                            <div class="d-flex justify-content-center">
                                {{ fight.order }}
                            </div>
                            <div
                                v-if="editionMode"
                                class="btn ms-0 p-0 d-flex justify-content-center"
                            >
                                <IconComponent name="drag-vertical" />
                            </div>
                        </th>
                        <td
                            :ref="`fights-tr-red-${fight.id}`"
                            class="cell-red word-break-all"
                        >
                            {{ getBoxerDisplayName(fight.boxer1) }}
                        </td>
                        <td
                            :ref="`fights-tr-blue-${fight.id}`"
                            class="cell-blue word-break-all"
                        >
                            {{ getBoxerDisplayName(fight.boxer2) }}
                        </td>
                        <td class="fight-extra-infos">
                            <div class="me-1">
                                <i
                                    v-if="fight.boxer1.gender == Gender.FEMALE"
                                    class="bi bi-gender-female"
                                ></i>
                                <i
                                    v-if="fight.boxer1.gender == Gender.MALE"
                                    class="bi bi-gender-male"
                                ></i>
                                <span v-if="fight.modalityErrors.length > 0"
                                    ><i class="bi bi-exclamation-circle-fill"></i
                                ></span>
                            </div>
                            <div>
                                <i class="bi bi-stopwatch me-1 d-none d-md-inline"></i>
                                <span>{{ getFightDurationAsString(fight.rounds, fight.roundDurationSeconds) }}</span>
                            </div>
                        </td>
                        <td
                            v-if="editionMode"
                            class="text-end"
                        >
                            <button
                                class="btn btn-sm btn-light m-1"
                                @click="switchFight(fight.id)"
                            >
                                <i class="bi bi-arrow-left-right" />
                            </button>
                            <button
                                class="btn btn-outline-danger btn-sm m-1"
                                @click="removeFromFightCard(fight.id)"
                            >
                                <i class="bi bi-person-dash-fill" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div
                v-if="getNbFights() == 0"
                class="justify-content-center m-4 text-center"
            >
                <div class="mb-4"><i>Your fight card is empty</i></div>
                <div>
                    Setup the first fight using the
                    <router-link
                        :to="{ name: 'selector' }"
                        :class="{ active: $route.path.startsWith('/selector') }"
                    >
                        Selector
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Boxer, Fight } from "@/types/boxing.d"
import { ExternalService } from "@/services/external.service"
import { FileType } from "@/types/api"
import { getFightDurationAsString } from "@/utils/string.utils"
import Sortable from "sortablejs"
import IconComponent from "./core/icon.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { watch } from "vue"
import { getBoxerDisplayName } from "@/utils/labels.utils"
import { Gender } from "@/shared/types/modality.type"

export default {
    components: {
        IconComponent,
    },
    data() {
        return {
            getBoxerDisplayName,
            getFightDurationAsString,
            Gender: Gender,
            fightStore: useFightStore(),
            uiStore: useUiStore(),
            boxerStore: useBoxerStore(),
            tournamentStore: useTournamentStore(),
            editionMode: false,
            fightCard: [] as (Fight & {
                boxer1: Boxer
                boxer2: Boxer
            })[],
        }
    },
    created() {
        this.fightStore.fetchFights()
    },
    mounted() {
        watch(
            () => this.fightStore.fights,
            () => {
                this.fightCard = this.fightStore.fights.map((fight: Fight) => {
                    return {
                        ...fight,
                        boxer1: this.boxerStore.getBoxerById(fight.boxer1Id) as Boxer,
                        boxer2: this.boxerStore.getBoxerById(fight.boxer2Id) as Boxer,
                    }
                })
            },
            { immediate: true, deep: true }
        )
        watch(
            () => this.editionMode,
            () => {
                this.initSortable()
            }
        )
    },
    methods: {
        switchFight(fightId: string) {
            this.fightStore.switchFight(fightId)
            const divRed = (this.$refs[`fights-tr-red-${fightId}`] as HTMLElement[])[0]
            const divBlue = (this.$refs[`fights-tr-blue-${fightId}`] as HTMLElement[])[0]

            divRed.classList.add("halo")
            divBlue.classList.add("halo")
            setTimeout(() => {
                divRed.classList.remove("halo")
                return divBlue.classList.remove("halo")
            }, 1000)
        },
        initSortable() {
            const table = this.$refs.sortableTable as HTMLElement
            const tbody = table?.querySelector("tbody")

            if (!tbody) {
                return
            }

            Sortable.create(tbody, {
                animation: 150,
                onEnd: async (evt: { oldIndex?: number; newIndex?: number }) => {
                    if (evt?.oldIndex !== undefined && evt?.newIndex !== undefined) {
                        await this.fightStore.updateFightOrder(this.fightCard[evt.oldIndex].id, evt.newIndex)
                    }
                },
                handle: ".handle",
                scroll: true,
                direction: "horizontal",
            })
        },
        async downloadFile(fileType: FileType) {
            if (!this.tournamentStore.currentTournamentId) {
                return
            }
            if (fileType === "xlsx") {
                await ExternalService.downloadFightCardXlsx(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "csv") {
                await ExternalService.downloadFightCardCsv(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "png") {
                await ExternalService.downloadFightCardPng(this.tournamentStore.currentTournamentId)
            }
            if (fileType === "pdf") {
                await ExternalService.downloadFightCardPdf(this.tournamentStore.currentTournamentId)
            }
        },
        getNbFights() {
            return this.fightCard.length
        },
        removeFromFightCard(fightId: string) {
            this.fightStore.removeFromFightCard([fightId])
            this.fightStore.fetchFights()
        },
    },
}
</script>
<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
.edition-mode {
    .fight-extra-infos {
        display: none;

        @include media-breakpoint-up(md) {
            display: block;
        }
    }
}
.cell-red {
    background-color: #97161618 !important;
}
.cell-blue {
    background-color: #1638972c !important;
}

.word-break-all {
    word-break: break-all;
}

/* Light mode halo */
@keyframes halo-light {
    0% {
        box-shadow: 0 0 0 rgba(0, 123, 255, 0);
    }
    50% {
        box-shadow: 0 0 20px 10px rgba(92, 94, 95, 0.3);
    }
    100% {
        box-shadow: 0 0 0 rgba(0, 123, 255, 0);
    }
}

/* Dark mode halo */
@keyframes halo-dark {
    0% {
        box-shadow: 0 0 0 rgba(255, 193, 7, 0);
    }
    50% {
        box-shadow: 0 0 20px 10px rgba(158, 158, 158, 0.3);
    }
    100% {
        box-shadow: 0 0 0 rgb(255, 255, 255);
    }
}

/* Halo animation based on theme */
[data-bs-theme="light"] .halo {
    animation: halo-light 1s ease-in-out;
}

[data-bs-theme="dark"] .halo {
    animation: halo-dark 1s ease-in-out;
}
</style>
