<template>
    <div
        class="card mb-2"
        :class="{
            'border-success': fightStore.isCompeting(boxer, opponent),
        }"
    >
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div>
                    <button
                        v-if="fightStore.canCompete(boxer, opponent)"
                        class="btn btn-outline-success btn-sm"
                        @click="fightStore.addToFightCard(boxer, opponent)"
                    >
                        <i class="bi bi-person-plus-fill" />
                    </button>
                    <button
                        v-if="fightStore.isCompeting(boxer, opponent)"
                        class="btn btn-outline-danger btn-sm"
                        @click="fightStore.removeFromFightCard(boxer, opponent)"
                    >
                        <i class="bi bi-person-dash-fill" />
                    </button>

                    {{ boxerStore.getBoxerDisplayName(opponent) }}
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
                        :modality-error="boxerStore.getOpponentModalityError(boxer, opponent, ModalityErrorType.AGE)"
                    />
                    <RecordBadgeComponent
                        :boxer="opponent"
                        :modality-error="
                            boxerStore.getOpponentModalityError(boxer, opponent, ModalityErrorType.PRIZE_LIST)
                        "
                    />
                    <WeightBadgeComponent
                        :boxer="opponent"
                        :modality-error="boxerStore.getOpponentModalityError(boxer, opponent, ModalityErrorType.WEIGHT)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { ModalityErrorType } from "@/types/modality.d"
import { Boxer } from "@/types/boxing.d"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"

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
            ModalityErrorType: ModalityErrorType,
            fightStore: useFightStore(),
            boxerStore: useBoxerStore(),
        }

        return ret
    },
})
</script>
