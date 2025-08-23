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
                    <WeightBadgeComponent
                        :boxer="opponent"
                        :modality-errors="opponent.modalityErrors"
                    />
                </div>
            </div>
            <div
                v-if="expandDetails"
                class="expanded-details flex-wrap align-items-stretch d-block d-md-flex border"
                @click="expandDetails = !expandDetails"
            >
                <EligibilityDetailsComponent
                    :boxer="opponent"
                    :modality-errors="opponent.modalityErrors"
                />
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
import { ModalityErrorType } from "@/api"
import { Boxer, Opponent } from "@/types/boxing.d"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import EligibilityDetailsComponent from "@/components/shared/badges/eligibility-details.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"
import { useTournamentBoxerStore } from "@/stores/tournamentBoxer.store"
import IconComponent from "@/components/shared/core/icon.component.vue"

export default defineComponent({
    components: {
        RecordBadgeComponent: RecordBadgeComponent,
        LinkedFightsBadgeComponent: LinkedFightsBadgeComponent,
        EligibilityDetailsComponent: EligibilityDetailsComponent,
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
<style lang="scss">
.expanded-details {
    & > div {
        flex: 0 0 50%; /* each item takes 50% width. So 2 items max per line*/
        padding: 10px;
        margin: 0;
        border: 1px solid var(--bs-border-color);
        min-width: 200px;
    }
}
</style>
