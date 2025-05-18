<template>
    <div class="card mb-2">
        <div
            class="card-body"
            role="tab"
        >
            <div class="d-flex justify-content-between">
                <div>
                    <IconComponent :name="boxer.attributes.gender == Gender.MALE ? 'male' : 'female'"></IconComponent>
                    {{ fightService.getBoxerDisplayName(boxer.attributes) }}
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ boxer.attributes.categoryShortText }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 pb-1">
                    <i>{{ boxer.attributes.club }}</i>
                </div>
                <div class="col-md-6 d-flex justify-content-end flex-wrap">
                    <LinkedFightsBadgeComponent :boxer="boxer" />
                    <PossibleBadgeComponent
                        :selected="boxer.opponents.filter((o) => o.isEligible).length"
                        :available="boxer.opponents.length"
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
import { Gender, Boxer, Opponent } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import PossibleBadgeComponent from "@/components/badges/possible-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"

import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"
import IconComponent from "../core/icon.component.vue"

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
<style lang="scss" scoped>
.card:hover {
    border: 1px solid black;
}
</style>
