<template>
    <div
        class="card mb-2"
        :class="{
            'border-success': opponent.fightId,
        }"
    >
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div>
                    <button
                        v-if="!opponent.fightId"
                        class="btn btn-outline-success btn-sm"
                        @click="addToFightCard(opponent)"
                    >
                        <i class="bi bi-person-plus-fill" />
                    </button>
                    <button
                        v-if="opponent.fightId"
                        class="btn btn-outline-danger btn-sm"
                        @click="removeFromFightCard(opponent)"
                    >
                        <i class="bi bi-person-dash-fill" />
                    </button>

                    {{ getBoxerDisplayName(opponent) }}
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ opponent.categoryShortText }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 pb-1">
                    <i>{{ opponent.club }}</i>
                </div>
                <div class="col-md-6 d-flex align-items-end justify-content-end flex-wrap">
                    <LinkedFightsBadgeComponent :boxer="opponent" />
                    <AgeBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                    <RecordBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                    <WeightBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { ModalityErrorType } from "@/shared/types/modality.type"
import { Boxer, Opponent } from "@/types/boxing.d"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { getBoxerDisplayName } from "@/utils/labels.utils"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"

export default defineComponent({
    components: {
        RecordBadgeComponent: RecordBadgeComponent,
        LinkedFightsBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent,
        AgeBadgeComponent: AgeBadgeComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
        opponent: {
            type: Object as PropType<Opponent>,
            required: true,
        },
    },
    data() {
        let ret = {
            getBoxerDisplayName,
            ModalityErrorType: ModalityErrorType,
            fightStore: useFightStore(),
            boxerStore: useBoxerStore(),
            boxerTournamentStore: useTournamentBoxerStore(),
        }

        return ret
    },
    mounted() {},
    methods: {
        addToFightCard(opponent: Opponent) {
            this.fightStore.addToFightCard(this.boxer, opponent)
        },
        removeFromFightCard(opponent: Opponent) {
            if (!opponent.fightId) {
                return
            }
            this.fightStore.removeFromFightCard([opponent.fightId])
            this.boxerTournamentStore.fetchBoxerOpponents(this.boxer.id)
        },
    },
})
</script>
