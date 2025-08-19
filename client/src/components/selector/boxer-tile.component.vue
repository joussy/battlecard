<template>
    <div class="card mb-2">
        <div
            class="card-body pt-1 pb-1"
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
                <div class="col-md-6 d-flex align-items-end justify-content-end flex-wrap gap-1">
                    <LinkedFightsBadgeComponent :boxer="boxer" />
                    <PossibleBadgeComponent
                        v-if="boxer.eligibleFights"
                        :selected="boxer.eligibleFights"
                        :available="nbOpponents"
                    />
                    <AgeBadgeComponent :boxer="boxer" />
                    <RecordBadgeComponent :boxer="boxer" />
                    <WeightBadgeComponent :boxer="boxer" />
                </div>
            </div>
            <div class="border-top mt-2 pt-2 gap-2 d-flex justify-content-end">
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="$router.push({ name: 'selector-tile', params: { id: boxer.id } })"
                >
                    <i class="bi bi-eye" />
                    <span class="ms-1">Select opponents</span>
                </button>
                <button
                    class="btn btn-outline-success btn-sm"
                    @click="editBoxer()"
                >
                    <i class="bi bi-clipboard" />
                    <span class="d-none d-sm-inline ms-2">Edit boxer</span>
                </button>
                <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="copyToClipboard()"
                >
                    <i class="bi bi-clipboard" />
                    <span class="d-none d-sm-inline ms-2">Copy to clipboard</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Boxer } from "@/types/boxing.d"
import { Gender, ModalityErrorType } from "@/shared/types/modality.type"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
import PossibleBadgeComponent from "@/components/shared/badges/possible-badge.component.vue"

import IconComponent from "@/components/shared/core/icon.component.vue"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import { useTournamentStore } from "@/stores/tournament.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"

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
        copyToClipboard() {
            const text = getClipboardText(this.boxer)
            navigator.clipboard.writeText(text)
        },
        editBoxer() {
            if (!this.boxer) {
                return
            }
            this.boxerStore.boxerToEdit = this.boxer
        },
    },
})
</script>
