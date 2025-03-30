<template>
    <div class="card mb-2">
        <div
            class="card-body pt-0 pb-1 ps-1 pe-0 ps-md-2 pe-md-2 mt-1 mb-1"
            role="tab"
            @click="toggleCollapse(boxer)"
        >
            <div class="d-flex flex-row align-items-center">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <div>
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Gender, Boxer, Opponent } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import OpponentTileComponent from "@/components/selector/opponent-tile.component.vue"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import PossibleBadgeComponent from "@/components/badges/possible-badge.component.vue"

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
        getOpponentsToDisplay(): Readonly<Opponent[]> {
            return this.boxer.opponents.filter((o) => {
                if (uiStore.hideNonMatchableOpponents && !o.isEligible) return false
                return true
            })
        },
    },
})
</script>
