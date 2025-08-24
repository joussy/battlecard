<template>
    <div class="eligibility-details-card">
        <div class="d-flex align-items-start">
            <LinkedFightsBadgeComponent
                :boxer="boxer"
                class="me-2"
            />
            <span class="eligibility-title">{{ $t("eligibilityDetails.linkedFights", { count: boxer.selectedFights }) }}</span>
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
            <span class="eligibility-title">{{ $t("eligibilityDetails.ageYears", { age: getBoxerAgeValue(boxer.birthDate) }) }}</span>
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
            <span class="eligibility-title">{{ $t("eligibilityDetails.foughtTimes", { fights: boxer.nbFights }) }}</span>
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
            <span class="eligibility-title">{{ $t("eligibilityDetails.weighsKg", { weight: boxer.weight }) }}</span>
        </div>
        <div class="eligibility-explanations">{{ getWeightExplanation }}</div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import { Boxer } from "@/types/boxing"
import { ModalityErrorDao, ModalityErrorType } from "@/api"
import { getBoxerAge } from "@/utils/string.utils"

const { t: $t } = useI18n()

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
        return $t("eligibilityDetails.alreadyScheduled")
    } else {
        return $t("eligibilityDetails.notScheduled")
    }
})

const getAgeExplanation = computed((): string => {
    if (props.modalityErrors?.some((error) => error.type == ModalityErrorType.AGE)) {
        return $t("eligibilityDetails.ageTooHigh")
    } else {
        return $t("eligibilityDetails.ageMeetsRequirements")
    }
})

const getRecordExplanation = computed((): string => {
    if (props.modalityErrors?.some((error) => error.type == ModalityErrorType.PRIZE_LIST)) {
        return $t("eligibilityDetails.recordTooHigh")
    } else {
        return $t("eligibilityDetails.recordMeetsRequirements")
    }
})

const getWeightExplanation = computed((): string => {
    if (props.modalityErrors?.find((error) => error.type == ModalityErrorType.WEIGHT)) {
        return $t("eligibilityDetails.weightTooHigh")
    } else {
        return $t("eligibilityDetails.weightMeetsRequirements")
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
