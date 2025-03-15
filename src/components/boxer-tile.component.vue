<template>
    <div
        class="card-header pt-0 pb-1 ps-1 pe-0 ps-md-2 pe-md-2"
        role="tab"
        :class="{ collapsed: !isCollapsed() }"
        @click="toggleCollapse(boxer)"
    >
        <div class="d-flex flex-row align-items-center">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                    <div>
                        <i
                            class="bi"
                            :class="isCollapsed() ? 'bi-chevron-right' : 'bi-chevron-down'"
                        />
                        {{ fightService.getBoxerDisplayName(boxer.attributes) }}
                    </div>
                    <div
                        class="font-italic text-right"
                        style="font-size: 14px"
                    >
                        {{ boxer.attributes.club }}
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div>
                        <span class="me-1">
                            <Icon
                                v-if="boxer.attributes.gender == Gender.MALE"
                                name="male"
                                height="17"
                            />
                            <Icon
                                v-if="boxer.attributes.gender == Gender.FEMALE"
                                name="female"
                                height="17"
                            />
                        </span>
                        <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
                            <i>{{ boxer.attributes.category }}</i>
                        </span>
                        <span class="d-inline d-sm-none">
                            <i>{{ boxer.attributes.categoryShortText }}</i>
                        </span>
                    </div>
                    <div>
                        <FightRecordBadgeComponent :boxer="boxer" />
                        <AgeBadgeComponent :boxer="boxer" />
                        <RecordBadgeComponent :boxer="boxer" />
                        <WeightBadgeComponent :boxer="boxer" />
                        <PossibleBadgeComponent
                            :selected="boxer.opponents.filter((o) => o.isEligible).length"
                            :available="boxer.opponents.length"
                        />
                    </div>
                </div>
            </div>
            <div class="ms-2">
                <!-- <button
                    class="btn btn-outline-secondary"
                    @click="boxerEdit()"
                >
                    <i class="bi bi-pencil"></i>
                </button> -->
            </div>
        </div>
    </div>
    <div
        v-show="!isCollapsed()"
        :id="'collapse-' + boxer.attributes.id"
        class="collapse"
        :class="{ show: !isCollapsed() }"
    >
        <div class="card-body ps-0 pe-0 pt-0 pb-0">
            <ul class="list-group rounded-0">
                <li
                    v-for="opponent in getOpponentsToDisplay()"
                    class="list-group-item d-flex border-start-0 border-end-0"
                >
                    <OpponentTileComponent
                        :boxer="boxer"
                        :opponent="opponent.boxer"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Gender, Boxer, Opponent } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import OpponentTileComponent from "@/components/opponent-tile.component.vue"
import RecordBadgeComponent from "@/components/core/record-badge.component.vue"
import AgeBadgeComponent from "@/components/core/age-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/core/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/core/weight-badge.component.vue"
import PossibleBadgeComponent from "@/components/core/possible-badge.component.vue"

import IconComponent from "@/components/core/icon.component.vue"
import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
        RecordBadgeComponent: RecordBadgeComponent,
        FightRecordBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent,
        PossibleBadgeComponent: PossibleBadgeComponent,
        AgeBadgeComponent: AgeBadgeComponent,
        Icon: IconComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
    },
    emits: ["boxer-edit"],
    data() {
        return {
            store: fightService.store(),
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            fightService: fightService,
        }
    },
    methods: {
        toggleCollapse(boxer: Readonly<Boxer>): void {
            const isCollapsed = uiStore.boxers.get(boxer.attributes.id)?.collapsed
            uiStore.collapseAll()
            uiStore.collapse(boxer.attributes.id, !isCollapsed)
        },
        boxerEdit(): void {
            this.$emit("boxer-edit")
        },
        isCollapsed() {
            return uiStore.createOrGetBoxerUi(this.boxer.attributes.id).collapsed
        },
        getOpponentsToDisplay(): Readonly<Opponent[]> {
            return this.boxer.opponents.filter((o) => {
                if (uiStore.hideNonMatchableOpponents && !o.isEligible) return false
                return true
            })
        },
    },
})
</script>
