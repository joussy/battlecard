<template>
    <div class="eligibility-details-card">
        <div class="d-flex align-items-start">
            <LinkedFightsBadgeComponent
                :boxer="boxer"
                class="me-2"
            />
            <span class="eligibility-title">Linked to {{ boxer.selectedFights }} fights</span>
            <!-- <i class="bi bi-check-circle-fill text-success ms-1"></i> -->
        </div>
        <div class="eligibility-explanations">
            {{ getSelectedFightsExplanation }}
        </div>
    </div>
    <div class="eligibility-details-card">
        <div class="d-flex align-items-start">
            <AgeBadgeComponent
                class="me-2"
                :boxer="boxer"
                :modality-errors="modalityErrors"
            />
            <span class="eligibility-title">{{ getBoxerAgeValue(boxer.birthDate) }} years old</span>
        </div>
        <div class="eligibility-explanations">
            {{ getAgeExplanation }}
        </div>
    </div>
    <div class="eligibility-details-card">
        <div class="d-flex align-items-start">
            <RecordBadgeComponent
                class="me-2"
                :boxer="boxer"
                :modality-errors="modalityErrors"
            />
            <span class="eligibility-title">Has already fought {{ boxer.nbFights }} times</span>
        </div>
        <div class="eligibility-explanations">{{ getRecordExplanation }}</div>
    </div>
    <div class="eligibility-details-card">
        <div class="d-flex align-items-start">
            <WeightBadgeComponent
                class="me-2"
                :boxer="boxer"
                :modality-errors="modalityErrors"
            />
            <span class="eligibility-title">Weighs {{ boxer.weight }} kg</span>
        </div>
        <div class="eligibility-explanations">{{ getWeightExplanation }}</div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao, ModalityErrorType } from "@/api"
import { getBoxerAge } from "@/utils/string.utils"

interface Props {
    boxer: Boxer
    modalityErrors?: ModalityErrorDao[] | null
}

const props = withDefaults(defineProps<Props>(), {
    modalityErrors: null,
})

const getBoxerAgeValue = (birthDate: Date): number => {
    return getBoxerAge(birthDate)
}

const getSelectedFightsExplanation = computed((): string => {
    if ((props.boxer.selectedFights ?? 0) > 0) {
        return "This boxer is already scheduled for fights, which may affect their eligibility."
    } else {
        return "This boxer is not scheduled for any fights."
    }
})

const getAgeExplanation = computed((): string => {
    if (props.modalityErrors?.some((error) => error.type == ModalityErrorType.AGE)) {
        return "Age difference is too high. Boxer must be within 2 years of the opponent's age."
    } else {
        return "This boxer meets the age requirements, being within 2 years of the opponent's age."
    }
})

const getRecordExplanation = computed((): string => {
    if (props.modalityErrors?.some((error) => error.type == ModalityErrorType.PRIZE_LIST)) {
        return "Fight record difference is too high. Boxer must have fewer than 3 fights difference with the opponent."
    } else {
        return "This boxer meets the record requirements."
    }
})

const getWeightExplanation = computed((): string => {
    if (props.modalityErrors?.find((error) => error.type == ModalityErrorType.WEIGHT)) {
        return "Weight difference is too high. Boxer must be within 3 kg of the opponent's weight."
    } else {
        return "This boxer meets the weight requirements, being within 3 kg of the opponent's weight."
    }
})
</script>
<style scoped lang="scss">
.eligibility-explanations {
    font-style: italic;
}
.eligibility-title {
    flex: 1 1 auto; /* allows the title to take available space */
}
</style>
