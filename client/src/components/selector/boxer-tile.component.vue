<template>
    <div class="card mb-2">
        <div
            class="card-body pt-1 pb-1"
            role="tab"
        >
            <div class="d-flex justify-content-between">
                <div>
                    <IconComponent :name="props.boxer.gender == Gender.MALE ? 'male' : 'female'"></IconComponent>
                    {{ getBoxerDisplayName(props.boxer) }}
                </div>
                <div
                    class="font-italic text-right"
                    style="font-size: 14px"
                >
                    {{ props.boxer.categoryShortText }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 pb-1">
                    <i>{{ props.boxer.club }}</i>
                </div>
                <div class="col-md-6 d-flex align-items-end justify-content-end flex-wrap gap-1">
                    <LinkedFightsBadgeComponent :boxer="props.boxer" />
                    <PossibleBadgeComponent
                        v-if="props.boxer.eligibleFights"
                        :selected="props.boxer.eligibleFights"
                        :available="props.nbOpponents"
                    />
                    <AgeBadgeComponent :boxer="props.boxer" />
                    <RecordBadgeComponent :boxer="props.boxer" />
                    <WeightBadgeComponent :boxer="props.boxer" />
                </div>
            </div>
            <div class="border-top mt-2 pt-2 gap-2 d-flex justify-content-end">
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="$router.push({ name: 'selector-tile', params: { id: props.boxer.id } })"
                >
                    <i class="bi bi-eye" />
                    <span class="ms-1">Select opponents</span>
                </button>
                <button
                    class="btn btn-outline-success btn-sm"
                    @click="editBoxer()"
                >
                    <i class="bi bi-pencil" />
                    <span class="ms-2">Edit</span>
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
import { Boxer } from "@/types/boxing.d"
import { Gender } from "@/api"
import RecordBadgeComponent from "@/components/shared/badges/record-badge.component.vue"
import AgeBadgeComponent from "@/components/shared/badges/age-badge.component.vue"
import WeightBadgeComponent from "@/components/shared/badges/weight-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/shared/badges/linked-fights-badge.component.vue"
import PossibleBadgeComponent from "@/components/shared/badges/possible-badge.component.vue"

import IconComponent from "@/components/shared/core/icon.component.vue"
import { useBoxerStore } from "@/stores/boxer.store"
import { getBoxerDisplayName, getClipboardText } from "@/utils/labels.utils"

interface Props {
    boxer: Boxer
    nbOpponents?: number
}

const props = withDefaults(defineProps<Props>(), {
    nbOpponents: undefined,
})

const boxerStore = useBoxerStore()

const copyToClipboard = () => {
    const text = getClipboardText(props.boxer)
    navigator.clipboard.writeText(text)
}

const editBoxer = () => {
    if (!props.boxer) {
        return
    }
    boxerStore.boxerToEdit = props.boxer
}
</script>
