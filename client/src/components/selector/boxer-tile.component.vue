<template>
    <div class="card mb-2">
        <div
            class="card-body"
            role="tab"
        >
            <div class="d-flex justify-content-between">
                <div>
                    <IconComponent :name="boxer.gender == Gender.MALE ? 'male' : 'female'"></IconComponent>
                    {{ getBoxerDisplayName(boxer) }}
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ boxer.categoryShortText }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 pb-1">
                    <i>{{ boxer.club }}</i>
                </div>
                <div class="col-md-6 d-flex align-items-end justify-content-end flex-wrap">
                    <LinkedFightsBadgeComponent :boxer="boxer" />
                    <PossibleBadgeComponent
                        v-if="boxer.selectedFights"
                        :selected="boxer.selectedFights"
                        :available="nbOpponents"
                    />
                    <AgeBadgeComponent :boxer="boxer" />
                    <RecordBadgeComponent :boxer="boxer" />
                    <WeightBadgeComponent :boxer="boxer" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Boxer } from "@/types/boxing.d"
import { Gender, ModalityErrorType } from "@/shared/types/modality.type"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"
import PossibleBadgeComponent from "@/components/badges/possible-badge.component.vue"

import IconComponent from "../core/icon.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { getBoxerDisplayName } from "@/utils/labels.utils"

export default defineComponent({
    components: {
        RecordBadgeComponent,
        WeightBadgeComponent,
        PossibleBadgeComponent,
        AgeBadgeComponent,
        LinkedFightsBadgeComponent,
        IconComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
        nbOpponents: {
            type: Object as PropType<number | undefined>,
            default: undefined,
        },
    },
    emits: ["boxer-edit"],
    data() {
        return {
            getBoxerDisplayName,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            uiStore: useUiStore(),
            boxerStore: useBoxerStore(),
            tournamentBoxerStore: useTournamentBoxerStore(),
            tournamentStore: useTournamentStore(),
        }
    },
    methods: {
        boxerEdit(): void {
            this.$emit("boxer-edit")
        },
    },
})
</script>
<style lang="scss" scoped>
.card:hover {
    border: 1px solid black;
}
</style>
