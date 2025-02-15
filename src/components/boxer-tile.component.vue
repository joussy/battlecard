<template>
    <div
        class="card-header pt-0 pb-1"
        role="tab"
        :class="{ collapsed: !boxer.collapsed }"
        @click="toggleCollapse(boxer)"
    >
        <div class="d-flex flex-row align-items-center">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                    <div class="">
                        <i
                            class="bi"
                            :class="boxer.collapsed ? 'bi-chevron-right' : 'bi-chevron-down'"
                        />
                        {{ store.getBoxerDisplayName(boxer) }}
                    </div>
                    <div
                        class="font-italic text-right"
                        style="font-size: 14px"
                    >
                        {{ boxer.attributes.club }}
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div>
                        <span class="me-1">
                            <Icon
                                v-if="boxer.attributes.gender == Gender.MALE"
                                name="male"
                                height="17"
                            />
                            <Icon
                                v-if="boxer.attributes.gender == Gender.FEMALE"
                                name="female"
                                height="17"
                            />
                        </span>
                        <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
                            <i>{{ boxer.attributes.category }}</i>
                        </span>
                        <span class="d-inline d-sm-none">
                            <i>{{ boxer.attributes.categoryShortText }}</i>
                        </span>
                    </div>
                    <div>
                        <FightRecordBadgeComponent :boxer="boxer" />
                        <RecordBadgeComponent :boxer="boxer" />
                        <WeightBadgeComponent :boxer="boxer" />
                        <PossibleBadgeComponent
                            :selected="boxer.opponents.filter((o) => o.isEligible).length"
                            :available="boxer.opponents.length"
                        />
                    </div>
                </div>
            </div>
            <div class="ms-2">
                <!-- <button
                    class="btn btn-outline-secondary"
                    @click="boxerEdit()"
                >
                    <i class="bi bi-pencil"></i>
                </button> -->
            </div>
        </div>
    </div>
    <div
        v-show="!boxer.collapsed"
        :id="'collapse-' + boxer.attributes.id"
        class="collapse"
        :class="{ show: !boxer.collapsed }"
    >
        <div class="card-body ps-0 pe-0 pt-0 pb-0">
            <ul class="list-group rounded-0">
                <li
                    v-for="opponent in boxer.opponents"
                    class="list-group-item d-flex border-start-0 border-end-0"
                >
                    <OpponentTileComponent
                        :boxer="boxer"
                        :opponent="opponent.boxer"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"
import { Gender, Boxer } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import OpponentTileComponent from "@/components/opponent-tile.component.vue"
import RecordBadgeComponent from "@/components/core/record-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/core/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/core/weight-badge.component.vue"
import PossibleBadgeComponent from "@/components/core/possible-badge.component.vue"

import { store } from "@/composables/fight.composable"
import IconComponent from "@/components/core/icon.component.vue"

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
        RecordBadgeComponent: RecordBadgeComponent,
        FightRecordBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent,
        PossibleBadgeComponent: PossibleBadgeComponent,
        Icon: IconComponent,
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
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
        }
    },
    methods: {
        toggleCollapse(boxer: Boxer): void {
            boxer.collapsed = !boxer.collapsed
        },
        boxerEdit(): void {
            console.log("boxer-edit")
            this.$emit("boxer-edit")
        },
    },
})
</script>
