<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-md-12 mb-4">
        <UploadComponent />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <BoxerSelectorComponent />
      </div>
      <div class="col-md-6">
        <FightCardComponent />
        <ClubStatisticsComponent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FightCardComponent from "@/components/fight-card.component.vue"
import ClubStatisticsComponent from "@/components/club-statistics.component.vue"
import UploadComponent from "@/components/options-panel.component.vue";
import BoxerSelectorComponent from "@/components/boxer-selector.component.vue";


export default defineComponent({
  components: {
    FightCardComponent: FightCardComponent,
    ClubStatisticsComponent: ClubStatisticsComponent,
    UploadComponent: UploadComponent,
    BoxerSelectorComponent: BoxerSelectorComponent
  },
  methods: {
  },
});
</script>

<style>
/* Add your component-specific styles here */
</style>
