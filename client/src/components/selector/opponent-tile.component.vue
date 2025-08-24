<template>
    <div
        class="card mb-2"
        :class="{
            'border-success': props.opponent.fightId,
        }"
    >
        <div class="card-body pt-1 pb-1">
            <div class="d-flex justify-content-between">
                <div>
                    <span>
                        {{ getBoxerDisplayName(props.opponent) }}
                    </span>
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ props.opponent.categoryShortText }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 pb-1">
                    <i>{{ props.opponent.club }}</i>
                </div>
                <div
                    v-if="!expandDetails"
                    class="col-md-6 d-flex align-items-end justify-content-end flex-wrap gap-1"
                    @click="expandDetails = !expandDetails"
                >
                    <LinkedFightsBadgeComponent :boxer="props.opponent" />
                    <AgeBadgeComponent
                        :boxer="props.opponent"
                        :modality-errors="props.opponent.modalityErrors"
                    />
                    <RecordBadgeComponent
                        :boxer="props.opponent"
                        :modality-errors="props.opponent.modalityErrors"
                    />
                    <WeightBadgeComponent
                        :boxer="props.opponent"
                        :modality-errors="props.opponent.modalityErrors"
                    />
                </div>
            </div>
            <div
                v-if="expandDetails"
                class="expanded-details flex-wrap align-items-stretch d-block d-md-flex border"
                @click="expandDetails = !expandDetails"
            >
                <EligibilityDetailsComponent
                    :boxer="props.opponent"
                    :modality-errors="props.opponent.modalityErrors"
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
                    v-else-if="!props.opponent.fightId"
                    class="btn btn-outline-success btn-sm"
                    @click="addToFightCard()"
                >
                    <!-- <i class="bi bi-person-plus-fill" /> -->
                    <IconComponent name="headgear" />
                    Add to fight card
                </button>
                <button
                    v-else-if="props.opponent.fightId"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFromFightCard()"
                >
                    <IconComponent name="headgear" />
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

<script setup lang="ts">
import { ref, watch, type PropType } from "vue"
import { useRouter } from "vue-router"
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

interface Props {
    boxer: Boxer
    opponent: Opponent
}

const props = defineProps<Props>()

const router = useRouter()
const fightStore = useFightStore()
const boxerStore = useBoxerStore()
const boxerTournamentStore = useTournamentBoxerStore()

const loading = ref(false)
const expandDetails = ref(false)

watch(
    () => props.opponent,
    () => {
        loading.value = false
    }
)

const addToFightCard = () => {
    loading.value = true
    fightStore.addToFightCard(props.boxer, props.opponent)
}

const removeFromFightCard = () => {
    if (!props.opponent.fightId) {
        return
    }
    loading.value = true
    fightStore.removeFromFightCard([props.opponent.fightId])
}

const goToOpponentTile = () => {
    router.push({ name: "selector-tile", params: { id: props.opponent.id } })
}

const copyToClipboard = () => {
    const text = getClipboardText(props.opponent)
    navigator.clipboard.writeText(text)
}
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
