<template>
    <div
        class="card mb-2"
        :class="{
            'border-success': fightService.isCompeting(boxer, opponent),
        }"
    >
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div>
                    <button
                        v-if="fightService.canCompete(boxer, opponent)"
                        class="btn btn-outline-success btn-sm"
                        @click="fightService.addToFightCard(boxer, opponent)"
                    >
                        <i class="bi bi-person-plus-fill" />
                    </button>
                    <button
                        v-if="fightService.isCompeting(boxer, opponent)"
                        class="btn btn-outline-danger btn-sm"
                        @click="fightService.removeFromFightCard(boxer, opponent)"
                    >
                        <i class="bi bi-person-dash-fill" />
                    </button>

                    {{ fightService.getBoxerDisplayName(opponent.attributes) }}
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ opponent.attributes.categoryShortText }}
                </div>
            </div>
            <div>
                <i>{{ opponent.attributes.club }}</i>
            </div>
            <div class="grid gap-0 column-gap-3">
                <AgeBadgeComponent
                    :boxer="opponent"
                    :modality-error="fightService.getOpponentModalityError(boxer, opponent, ModalityErrorType.AGE)"
                />
                <RecordBadgeComponent
                    :boxer="opponent"
                    :modality-error="
                        fightService.getOpponentModalityError(boxer, opponent, ModalityErrorType.PRIZE_LIST)
                    "
                />
                <WeightBadgeComponent
                    :boxer="opponent"
                    :modality-error="fightService.getOpponentModalityError(boxer, opponent, ModalityErrorType.WEIGHT)"
                />
                <LinkedFightsBadgeComponent :boxer="opponent" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { ModalityErrorType } from "@/types/modality.d"
import { Boxer } from "@/types/boxing.d"
import RecordBadgeComponent from "@/components/core/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/core/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/core/weight-badge.component.vue"
import AgeBadgeComponent from "@/components/core/age-badge.component.vue"
import FightService from "@/services/fight.service"
import fightService from "@/services/fight.service"

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
            type: Object as PropType<Boxer>,
            required: true,
        },
    },
    data() {
        let ret = {
            store: fightService.store(),
            fightService: FightService,
            ModalityErrorType: ModalityErrorType,
        }

        return ret
    },
})
</script>
