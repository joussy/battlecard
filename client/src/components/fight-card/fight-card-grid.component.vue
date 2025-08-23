<template>
    <table
        v-if="fightCard.length > 0"
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
                        <Icon name="drag-vertical" />
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
                        <Icon name="headgear" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { Boxer, Fight } from "@/types/boxing.d"
import { getFightDurationAsString } from "@/utils/string.utils"
import Sortable from "sortablejs"
import IconComponent from "@/components/shared/core/icon.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { watch, PropType } from "vue"
import { getBoxerDisplayName } from "@/utils/labels.utils"
import { Gender } from "@/api"

export default {
    components: {
        Icon: IconComponent,
    },
    props: {
        fightCard: {
            type: Array as PropType<
                (Fight & {
                    boxer1: Boxer
                    boxer2: Boxer
                })[]
            >,
            required: true,
        },
        editionMode: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["switchFight", "removeFromFightCard"],
    data() {
        return {
            getBoxerDisplayName,
            getFightDurationAsString,
            Gender: Gender,
            fightStore: useFightStore(),
        }
    },
    mounted() {
        watch(
            () => this.editionMode,
            () => {
                if (this.editionMode) {
                    this.initSortable()
                } else {
                    this.destroySortable()
                }
            }
        )
    },
    methods: {
        switchFight(fightId: string) {
            this.$emit("switchFight", fightId)
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
                        await this.fightStore.fetchFights()
                    }
                },
                handle: ".handle",
                scroll: true,
                direction: "horizontal",
            })
        },
        destroySortable() {
            const table = this.$refs.sortableTable as HTMLElement
            const tbody = table?.querySelector("tbody")

            if (!tbody) {
                return
            }

            Sortable.get(tbody)?.destroy()
        },
        removeFromFightCard(fightId: string) {
            this.$emit("removeFromFightCard", fightId)
        },
    },
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

.edition-mode .fight-extra-infos {
    display: none;

    @include media-breakpoint-up(md) {
        display: block;
    }
}
</style>
