<template>
    <div
        class="card mb-2"
        :class="{
            'border-success': opponent.fightId,
        }"
    >
        <div class="card-body pt-1 pb-1">
            <div class="d-flex justify-content-between">
                <div>
                    <span>
                        {{ getBoxerDisplayName(opponent) }}
                    </span>
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
                <div
                    v-if="!expandDetails"
                    class="col-md-6 d-flex align-items-end justify-content-end flex-wrap gap-1"
                    @click="expandDetails = !expandDetails"
                >
                    <LinkedFightsBadgeComponent :boxer="opponent" />
                    <AgeBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                    <RecordBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                    <WeightBadgeComponent :boxer="opponent" />
                </div>
            </div>
            <div class="d-flex flex-column align-items-end">
                <div
                    v-if="expandDetails"
                    class="gap-1"
                    @click="expandDetails = !expandDetails"
                >
                    <div>
                        <LinkedFightsBadgeComponent
                            :boxer="opponent"
                            class="me-2"
                        />Linked to fights
                        <div class="text-warning"><i>1 more fight than adviced</i></div>
                    </div>
                    <div class="border-top mt-1 pt-1">
                        <AgeBadgeComponent
                            :boxer="opponent"
                            :modality-errors="opponent.modalityErrors"
                        />
                        years old
                        <div class="text-warning"><i>12 months of difference than expected</i></div>
                    </div>
                    <div class="border-top mt-1 pt-1">
                        <RecordBadgeComponent
                            :boxer="opponent"
                            :modality-errors="opponent.modalityErrors"
                        />
                        Has already fought times
                        <div class="text-warning"><i>10 fights of difference is a lot</i></div>
                    </div>
                    <div class="border-top mt-1 pt-1">
                        <WeightBadgeComponent
                            :boxer="opponent"
                            :modality-errors="opponent.modalityErrors"
                        />
                        Weighted at kg
                        <div class="text-warning"><i>Too heavy, difference of 5 kg</i></div>
                    </div>
                </div>
            </div>
            <div class="border-top mt-2 pt-2 gap-2 d-flex justify-content-end">
                <button
                    v-if="loading"
                    class="btn btn-outline-secondary btn-sm"
                    disabled
                >
                    <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    <i class="ms-2">Loading...</i>
                </button>
                <button
                    v-else-if="!opponent.fightId"
                    class="btn btn-outline-success btn-sm"
                    @click="addToFightCard()"
                >
                    <!-- <i class="bi bi-person-plus-fill" /> -->
                    <Icon name="headgear" />
                    Add to fight card
                </button>
                <button
                    v-else-if="opponent.fightId"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFromFightCard()"
                >
                    <Icon name="headgear" />
                    Remove from fight card
                </button>
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="goToOpponentTile()"
                >
                    <i class="bi bi-eye" />
                    <span class="d-none d-sm-inline ms-1">Watch Profile</span>
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
import { ModalityErrorType } from "@/shared/types/modality.type"
import { Boxer, Opponent } from "@/types/boxing.d"
import RecordBadgeComponent from "@/components/badges/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/badges/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/badges/weight-badge.component.vue"
import AgeBadgeComponent from "@/components/badges/age-badge.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import IconComponent from "../core/icon.component.vue"

export default defineComponent({
    components: {
        RecordBadgeComponent: RecordBadgeComponent,
        LinkedFightsBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent,
        AgeBadgeComponent: AgeBadgeComponent,
        Icon: IconComponent,
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
            loading: false,
            expandDetails: false,
        }

        return ret
    },
    watch: {
        opponent: {
            handler() {
                this.loading = false
            },
        },
    },
    methods: {
        addToFightCard() {
            this.loading = true
            this.fightStore.addToFightCard(this.boxer, this.opponent)
        },
        removeFromFightCard() {
            if (!this.opponent.fightId) {
                return
            }
            this.loading = true
            this.fightStore.removeFromFightCard([this.opponent.fightId])
        },
        goToOpponentTile() {
            // this.$router.push({ name: "selector" })
            this.$router.push({ name: "selector-tile", params: { id: this.opponent.id } })
        },
        copyToClipboard() {
            const text = getClipboardText(this.opponent)
            navigator.clipboard.writeText(text)
        },
    },
})
</script>
