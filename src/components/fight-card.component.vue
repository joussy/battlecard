<template>
    <div :class="{ 'edition-mode': editionMode }">
        <div
            v-if="editionMode"
            id="editModeToast"
            class="d-md-none toast show bg-success text-white position-fixed top-0 start-50 translate-middle-x mt-3"
            role="alert"
        >
            <div class="toast-body text-center">
                <a
                    class="text-white fw-bold"
                    @click="editionMode = false"
                    >I'm Done editing</a
                >
            </div>
        </div>
        <div class="d-flex menu-card-tools">
            <div class="flex-grow-1"></div>
            <button
                type="button"
                class="btn btn-outline-success mb-3 ms-2"
                :class="{ active: editionMode }"
                @click="editionMode = !editionMode"
            >
                <i class="bi bi-pencil" />
            </button>
            <div
                v-if="userStore.account != null"
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
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Red</th>
                    <th scope="col">Blue</th>
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
            <draggable
                v-model="fightCard as unknown[] | undefined"
                tag="tbody"
                item-key="id"
                handle=".handle"
                @end="moved"
            >
                <template #item="{ element: fight }">
                    <tr>
                        <th scope="row">
                            <span>
                                {{ fight.order }}
                            </span>
                            <button
                                v-if="editionMode"
                                class="btn ms-0 handle p-0 ps-2"
                            >
                                <i class="bi bi-grip-horizontal" />
                            </button>
                        </th>
                        <td>{{ fightService.getBoxerDisplayName(fight.boxer1.attributes) }}</td>
                        <td>{{ fightService.getBoxerDisplayName(fight.boxer2.attributes) }}</td>
                        <td class="fight-extra-infos">
                            <div class="me-1">
                                <i
                                    v-if="fight.boxer1.attributes.gender == Gender.FEMALE"
                                    class="bi bi-gender-female"
                                ></i>
                                <i
                                    v-if="fight.boxer1.attributes.gender == Gender.MALE"
                                    class="bi bi-gender-male"
                                ></i>
                                <span v-if="fight.modalityErrors.length > 0"
                                    ><i class="bi bi-exclamation-circle-fill"></i
                                ></span>
                            </div>
                            <div>
                                <i class="bi bi-stopwatch me-1 d-none d-md-inline"></i>
                                <span>{{ getFightDuration(fight) }}</span>
                            </div>
                        </td>
                        <!-- <td>
                        <span v-for="modalityError in fight.modalityErrors">
                            <ModalityErrorComponent :modality-error="modalityError" />
                        </span>
                    </td> -->
                        <td v-if="editionMode">
                            <button
                                class="btn ms-0"
                                @click="fightService.switchFight(fight.id)"
                            >
                                <i class="bi bi-arrow-left-right" />
                            </button>
                            <button
                                class="btn btn-outline-danger btn-sm ms-2"
                                @click="fightService.removeFromFightCard(fight.boxer1, fight.boxer2)"
                            >
                                <i class="bi bi-person-dash-fill" />
                            </button>
                        </td>
                    </tr>
                </template>
            </draggable>
        </table>
    </div>
</template>

<script lang="ts">
import { Fight, Gender } from "@/types/boxing.d"
import fightService from "@/services/fight.service"
import { ApiService } from "@/services/api.service"
import { userStore } from "@/composables/user.composable"
import draggable from "vuedraggable"
import { FileType } from "@/types/api"
import { getFightDurationAsString } from "@/utils/string.utils"

export default {
    components: {
        draggable,
    },
    data() {
        return {
            Gender: Gender,
            fightStore: fightService.store(),
            fightService: fightService,
            userStore: userStore,
            editionMode: false,
        }
    },
    computed: {
        fightCard: {
            get() {
                return fightService.store().fightCard
            },
            set() {
                /* Avoid error on readonly collection */
            },
        },
    },
    methods: {
        async downloadFile(fileType: FileType) {
            await ApiService.downloadFightCard(fileType, this.fightStore.fightCard, this.fightStore.modality)
        },
        moved(evt: { oldIndex?: number; newIndex?: number }) {
            if (evt?.oldIndex !== undefined && evt?.newIndex !== undefined) {
                fightService.moveFight(this.fightCard[evt.oldIndex].id, evt.newIndex)
            }
        },
        getFightDuration(fight: Fight) {
            const fightDuration = this.fightStore.modality.getFightDuration(
                fight.boxer1.attributes,
                fight.boxer2.attributes
            )
            return getFightDurationAsString(fightDuration.rounds, fightDuration.roundDurationAsSeconds)
        },
    },
}
</script>
<style lang="scss">
@import "bootstrap/scss/bootstrap";
.edition-mode {
    .fight-extra-infos {
        display: none;

        @include media-breakpoint-up(md) {
            display: block;
        }
    }
}
</style>
