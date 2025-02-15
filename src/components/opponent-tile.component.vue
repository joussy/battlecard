<template>
    <div class="w-100">
        <div class="d-flex justify-content-between">
            <div class="">
                <button
                    v-if="store.canCompete(boxer, opponent)"
                    class="btn btn-outline-success btn-sm"
                    @click="store.addToFightCard(boxer, opponent)"
                >
                    <i class="bi bi-person-plus-fill" />
                </button>
                <button
                    v-if="store.isCompeting(boxer, opponent)"
                    class="btn btn-outline-danger btn-sm"
                    @click="store.removeFromFightCard(boxer, opponent)"
                >
                    <i class="bi bi-person-dash-fill" />
                </button>

                {{ store.getBoxerDisplayName(opponent) }}
            </div>
            <div
                class="font-italic text-right"
                style="font-size: 14px"
            >
                {{ opponent.attributes.club }}
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div>
                <i>{{ opponent.attributes.categoryShortText }}</i>
            </div>
            <div class="grid gap-0 column-gap-3">
                <LinkedFightsBadgeComponent :boxer="opponent" />
                <AgeBadgeComponent
                    :boxer="opponent"
                    :modality-error="store.getOpponentModalityError(boxer, opponent, ModalityErrorType.AGE)"
                />
                <RecordBadgeComponent
                    :boxer="opponent"
                    :modality-error="store.getOpponentModalityError(boxer, opponent, ModalityErrorType.PRIZE_LIST)"
                />
                <WeightBadgeComponent
                    :boxer="opponent"
                    :modality-error="store.getOpponentModalityError(boxer, opponent, ModalityErrorType.WEIGHT)"
                />
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

import { store } from "@/composables/fight.composable"

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
            store,
            ModalityErrorType: ModalityErrorType,
        }

        return ret
    },
})
</script>
