<template>
    <div
        v-if="boxer != null"
        class="card mb-3"
    >
        <div
            class="card-body pt-0 pb-1 ps-1 pe-0 ps-md-2 pe-md-2"
            role="tab"
        >
            <div>
                {{ fightService.getBoxerDisplayName(boxer.attributes) }}
            </div>
            <div>{{ getBirthDateAndAge(boxer) }}</div>
            <div>Weight: {{ boxer.attributes.weight }} kg</div>
            <div>License: {{ boxer.attributes.license }}</div>
            <div>Category: {{ boxer.attributes.category }}</div>
            <div>Club: {{ boxer?.attributes.club }}</div>
        </div>
    </div>
    <h5>Available opponents</h5>
    <div>
        <div class="ps-0 pe-0 pt-0 pb-0">
            <ul class="list-group rounded-0">
                <li
                    v-for="opponent in getOpponentsToDisplay()"
                    class="list-group-item d-flex border-start-0 border-end-0 border-top-0 border-bottom-1"
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
import { defineComponent } from "vue"
import { Boxer, Gender, Opponent } from "@/types/boxing.d"
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
import { differenceInYears, format } from "date-fns"

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
    setup() {},
    data() {
        return {
            fightStore: fightService.store(),
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            fightService: fightService,
        }
    },
    computed: {
        boxer() {
            const boxerId = this.$route.params.id
            return this.fightStore.boxers.find((b) => b.attributes.id == boxerId)
        },
    },
    mounted() {},
    methods: {
        getOpponentsToDisplay(): Readonly<Opponent[]> {
            return this.boxer?.opponents.filter((o) => !uiStore.hideNonMatchableOpponents || o.isEligible) ?? []
        },
        getBirthDateAndAge(boxer: Boxer): string {
            const age = differenceInYears(new Date(), boxer.attributes.birthDate)
            const birthDate = format(boxer.attributes.birthDate, "dd/MM/yyyy")
            return `${birthDate} - ${age} years old`
        },
    },
})
</script>
