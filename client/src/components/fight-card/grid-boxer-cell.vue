<template>
    <div class="d-flex flex-column align-items-start">
        <span>{{ getBoxerDisplayName(props.boxer) }} </span>
        <small class="d-none d-md-block mb-auto">{{ props.boxer.club }}</small>
        <div class="d-none d-lg-flex align-items-end justify-content-end gap-1 mt-1 w-100">
            <LinkedFightsBadgeComponent :boxer="props.boxer" />
            <AgeBadgeComponent :boxer="props.boxer" />
            <RecordBadgeComponent :boxer="props.boxer" />
            <WeightBadgeComponent :boxer="props.boxer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Boxer } from "@/types/boxing"
import { useLabels } from "@/utils/labels.utils"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
interface Props {
    boxer: Boxer
}

const { getBoxerDisplayName } = useLabels()
const props = withDefaults(defineProps<Props>(), {})
</script>
