<template>
  <div class="d-flex">
    <h3 class="flex-grow-1">
      Fighters
    </h3>
    <button
      @click="expandAll()"
      class="btn btn-secondary mb-3 ml-2"
    >
      <i class="bi bi-chevron-down" />
      /
      <i class="bi bi-chevron-right" />
    </button>
    <button
      @click="store.clear()"
      class="btn btn-danger mb-3 ml-2"
    >
      <i class="bi bi-trash" />
    </button>
  </div>
  <div
    class="card"
    v-for="(boxer, index) in store.boxers" 
    :key="boxer.attributes.id"
  >
    <div
      class="card-header pt-0 pb-1"
      role="tab"
      @click="toggleCollapse(index)"
      :class="{ collapsed: !boxer.collapsed }"
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
      :id="'collapse-' + index"
      v-show="!boxer.collapsed"
      class="collapse"
      :class="{ show: !boxer.collapsed }"
    >
      <div class="card-body">
        <ul class="list-group">
          <li
            class="list-group-item d-flex"
            v-for="opponent in boxer.opponents"
          >
            <OpponentTileComponent
              :boxer="boxer"
              :opponent="opponent.boxer"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { Gender } from '@/types/boxing.d'
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
    data() {
        let ret = {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
        };

        // this.fightCard = JSON.parse(localStorage.getItem('fightCard') || "{}");

        return ret;
    },
    mounted() {
        // if (localStorage.boxers) {
        //   this.boxers = JSON.parse(localStorage.boxers) || [];
        //   this.boxers = this.boxers.map(b => b.opponents)
        // }
        // if (localStorage.fightCard) {
        //   this.fightCard = JSON.parse(localStorage.fightCard) || [];
        // }
        if (localStorage.boxing) {
            // const boxingStorage: BoxingStorage = JSON.parse(localStorage.boxing) || {};
            // this.store.boxers = boxingStorage.boxers.map<Boxer>((b) => {
            //     return { attributes: b, collapsed: true, opponents: [] } as Boxer;
            // });
            this.store.computeBoxerOpponents();
        }
    },
    // watch: {
    //     boxers(newBoxers: Boxer[]) {
            // let toStore = newBoxers.map<Boxer>((b) => {
            //   let b1 = {...b};
            //   b1.opponents = [];
            //   return b1
            // });
        // },
        // fightCard: {
        //   handler(newFightCard) {
        //     (localStorage.boxingStorage as BoxingStorage).fights
        //   }, deep: true
        // }
    // },
    methods: {

        toggleCollapse(index: number): void {
            this.store.boxers[index].collapsed = !this.store.boxers[index].collapsed;
        },
        expandAll() {
            let collapse = true;
            if (this.store.boxers[0]?.collapsed) {
                collapse = false;
            }
            for (let [index] of this.store.boxers.entries()) {
                this.store.boxers[index].collapsed = collapse;
            }
        }
    },
});
</script>
  
<style>
/* Add your component-specific styles here */
</style>
