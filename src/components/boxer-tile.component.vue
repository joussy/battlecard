<template>
  <div
    class="card-header pt-0 pb-1"
    role="tab"
    :class="{ collapsed: !boxer.collapsed }"
    @click="toggleCollapse(boxer)"
  >
    <div>
      <div class="d-flex justify-content-between">
        <div class="">
          <i
            class="bi"
            :class="boxer.collapsed ? 'bi-chevron-down' : 'bi-chevron-right'"
          />
          {{ store.getBoxerDisplayName(boxer) }}
        </div>
        <div
          class="font-italic text-right"
          style="font-size: 14px;"
        >
          {{ boxer.attributes.club }}
        </div>
      </div>
      <div class="d-flex justify-content-between">
        <div>
          <span class="mr-1">
            <img
              v-if="boxer.attributes.gender == Gender.MALE"
              src="@/assets/icons/male.svg"
              height="17"
            >
            <img
              v-if="boxer.attributes.gender == Gender.FEMALE"
              src="@/assets/icons/female.svg"
              height="17"
            >
          </span>
          <span class="d-none d-sm-inline d-md-inline d-lg-inline d-xl-inline">
            <i>{{ boxer.attributes.category }}</i>
          </span>
          <span class="d-inline d-sm-none">
            <i>{{ boxer.attributes.categoryShortText }}</i>
          </span>
        </div>
        <div class="">                        
          <FightRecordBadgeComponent :boxer="boxer" />
          <NbFightsBadgeComponent :boxer="boxer" />
          <WeightBadgeComponent :boxer="boxer" />
          <span class="badge bg-light ml-2 pt-0 pb-0">
            🥊
            {{ boxer.opponents.filter(o => o.isEligible).length }}/{{ boxer.opponents.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div
    v-show="!boxer.collapsed"
    :id="'collapse-' + boxer.id"
    class="collapse"
    :class="{ show: !boxer.collapsed }"
  >
    <div class="card-body">
      <ul class="list-group">
        <li
          v-for="opponent in boxer.opponents"
          class="list-group-item d-flex"
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
import { PropType, defineComponent } from 'vue';
import { Gender, Boxer } from '@/types/boxing.d'
import { ModalityErrorType } from '@/types/modality.d'
import OpponentTileComponent from "@/components/opponent-tile.component.vue"
import NbFightsBadgeComponent from "@/components/core/nb-fights-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/core/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/core/weight-badge.component.vue"

import { store } from '@/composables/fight.composable';

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
        NbFightsBadgeComponent: NbFightsBadgeComponent,
        FightRecordBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent
    },
    props: {
        boxer:{
            type: Object as PropType<Boxer>,
            required: true
        }
    },
    data() {
        return {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
        };
    },
    methods: {
      toggleCollapse(boxer: Boxer): void {
          boxer.collapsed = !boxer.collapsed;
        }
    },
});
</script>
