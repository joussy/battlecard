<template>
  <div class="mr-3">
    <button
      v-if="store.canCompete(boxer, opponent)"
      @click="store.addToFightCard(boxer, opponent)"
      class="btn btn-success btn-sm"
    >
      <i class="bi bi-person-plus-fill" />
    </button>
    <button
      v-if="store.isCompeting(boxer, opponent)"
      @click="store.removeFromFightCard(boxer, opponent)"
      class="btn btn-danger btn-sm"
    >
      <i class="bi bi-person-dash-fill" />
    </button>
  </div>
  <div class="w-100">
    <div class="d-flex justify-content-between">
      <div class="">
        {{ store.getBoxerDisplayName(opponent) }}
      </div>
      <div
        class="font-italic text-right"
        style="font-size: 14px;"
      >
        {{ opponent.attributes.club }}
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <div>
        <i>{{ opponent.attributes.categoryShortText }}</i>
      </div>
      <div>
        <LinkedFightsBadgeComponent :boxer="opponent" />
        <NbFightsBadgeComponent
          :boxer="opponent"
          :modality-error="store.getOpponentModalityError(boxer, opponent, ModalityErrorType.PRIZE_LIST)"
        />
        <WeightBadgeComponent
          :boxer="opponent"
          :modality-error="store.getOpponentModalityError(boxer, opponent, ModalityErrorType.WEIGHT)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ModalityErrorType } from '@/types/modality.d'
import NbFightsBadgeComponent from "@/components/core/nb-fights-badge.component.vue"
import LinkedFightsBadgeComponent from "@/components/core/linked-fights-badge.component.vue"
import WeightBadgeComponent from "@/components/core/weight-badge.component.vue"

import { store } from '@/composables/fight.composable';

export default defineComponent({
    props: ['boxer', 'opponent'],
    components: {
        NbFightsBadgeComponent: NbFightsBadgeComponent,
        LinkedFightsBadgeComponent: LinkedFightsBadgeComponent,
        WeightBadgeComponent: WeightBadgeComponent
    },
    data() {
        let ret = {
            store,
            ModalityErrorType: ModalityErrorType,
        };

        return ret;
    }
});
</script>