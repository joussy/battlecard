<template>
    <table
        v-if="props.fightCard.length > 0"
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
                    {{ $t("fightCard.red") }}
                </th>
                <th
                    scope="col"
                    class="cell-blue"
                >
                    {{ $t("fightCard.blue") }}
                </th>
                <th
                    class="d-none d-md-table-cell"
                    scope="col"
                />
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr
                v-for="fight in props.fightCard"
                :key="fight.id"
            >
                <th
                    scope="row"
                    :class="{ handle: props.editionMode }"
                >
                    <div class="d-flex flex-column justify-content-center align-items-center">
                        <div>{{ fight.order }}</div>
                        <button
                            v-if="!props.editionMode"
                            class="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a
                                    class="dropdown-item"
                                    @click="$router.push({ name: 'selector-tile', params: { id: fight.boxer1.id } })"
                                >
                                    <i class="bi bi-eye" />
                                    {{ $t("fightCard.viewRedBoxerProfile") }}
                                </a>
                                <a
                                    class="dropdown-item"
                                    @click="$router.push({ name: 'selector-tile', params: { id: fight.boxer2.id } })"
                                >
                                    <i class="bi bi-eye" />
                                    {{ $t("fightCard.viewBlueBoxerProfile") }}
                                </a>
                                <a
                                    class="dropdown-item"
                                    @click="removeFromFightCard(fight.id)"
                                >
                                    <i class="bi bi-trash" />
                                    {{ $t("fightCard.deleteFight") }}
                                </a>
                                <a
                                    class="dropdown-item"
                                    @click="switchFight(fight.id)"
                                >
                                    <i class="bi bi-arrow-left-right" />
                                    {{ $t("fightCard.invertCorners") }}
                                </a>
                                <a
                                    class="dropdown-item"
                                    @click="copyFightToClipboard(fight)"
                                >
                                    <i class="bi bi-clipboard" />
                                    {{ $t("fightCard.copyFightToClipboard") }}
                                </a>
                            </li>
                        </ul>
                        <button
                            v-if="props.editionMode"
                            class="btn btn-sm btn-success"
                        >
                            <i class="bi bi-arrows-expand" />
                        </button>
                    </div>
                </th>
                <td
                    :id="`fights-tr-red-${fight.id}`"
                    class="cell-red word-break-all"
                >
                    <GridBoxerCell :boxer="fight.boxer1" />
                </td>
                <td
                    :id="`fights-tr-blue-${fight.id}`"
                    class="cell-blue word-break-all"
                >
                    <GridBoxerCell :boxer="fight.boxer2" />
                </td>
                <td class="d-none d-md-table-cell">
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
                        <i class="bi bi-stopwatch me-1 d-none d-lg-inline"></i>
                        <span>{{ getFightDurationAsString(fight.rounds, fight.roundDurationSeconds) }}</span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { Boxer, Fight } from "@/types/boxing.d"
import { getFightDurationAsString } from "@/utils/string.utils"
import Sortable from "sortablejs"
import { useFightStore } from "@/stores/fight.store"
import { Gender } from "@/api"
import GridBoxerCell from "./grid-boxer-cell.vue"
import { useLabels } from "@/utils/labels.utils"

const { t: $t } = useI18n()
const { getFightClipboardText } = useLabels()

interface Props {
    fightCard: (Fight & {
        boxer1: Boxer
        boxer2: Boxer
    })[]
    editionMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    editionMode: false,
})

const emit = defineEmits<{
    switchFight: [fightId: string]
    removeFromFightCard: [fightId: string]
}>()

const fightStore = useFightStore()
const sortableTable = ref<HTMLElement>()

onMounted(() => {
    watch(
        () => props.editionMode,
        () => {
            if (props.editionMode) {
                initSortable()
            } else {
                destroySortable()
            }
        }
    )
})

const switchFight = (fightId: string) => {
    emit("switchFight", fightId)
    const divRed = document.querySelector(`#fights-tr-red-${fightId}`) as HTMLElement
    const divBlue = document.querySelector(`#fights-tr-blue-${fightId}`) as HTMLElement

    if (divRed && divBlue) {
        divRed.classList.add("halo")
        divBlue.classList.add("halo")
        setTimeout(() => {
            divRed.classList.remove("halo")
            divBlue.classList.remove("halo")
        }, 1000)
    }
}

const initSortable = () => {
    const table = sortableTable.value
    const tbody = table?.querySelector("tbody")

    if (!tbody) {
        return
    }

    Sortable.create(tbody, {
        animation: 150,
        onEnd: async (evt: { oldIndex?: number; newIndex?: number }) => {
            if (evt?.oldIndex !== undefined && evt?.newIndex !== undefined) {
                await fightStore.updateFightOrder(props.fightCard[evt.oldIndex].id, evt.newIndex)
                await fightStore.fetchFights()
            }
        },
        handle: ".handle",
        scroll: true,
        direction: "horizontal",
    })
}

const destroySortable = () => {
    const table = sortableTable.value
    const tbody = table?.querySelector("tbody")

    if (!tbody) {
        return
    }

    Sortable.get(tbody)?.destroy()
}

const removeFromFightCard = (fightId: string) => {
    emit("removeFromFightCard", fightId)
}

const copyFightToClipboard = (fight: Fight) => {
    const text = getFightClipboardText(fight)
    navigator.clipboard.writeText(text)
}
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";

.cell-red {
    background-color: #97161618 !important;
}
.cell-blue {
    background-color: #1638972c !important;
}

.word-break-all {
    word-break: break-word;
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
