<template>
  <div class="d-flex">
    <h3 class="flex-grow-1">
      Fighters
    </h3>
    <button
      class="btn btn-secondary mb-3 ml-2"
      @click="expandAll()"
    >
      <i class="bi bi-chevron-down" />
      /
      <i class="bi bi-chevron-right" />
    </button>
    <button
      class="btn btn-danger mb-3 ml-2"
      @click="store.clear()"
    >
      <i class="bi bi-trash" />
    </button>
  </div>
  <div
    v-for="(boxer) in store.boxers"
    :key="boxer.attributes.id" 
    class="card"
  >
    <BoxerTileComponent :boxer="boxer" />
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { Gender } from '@/types/boxing.d'
import { ModalityErrorType } from '@/types/modality.d'
import BoxerTileComponent from "@/components/boxer-tile.component.vue"

import { store } from '@/composables/fight.composable';

export default defineComponent({
    components: {
      BoxerTileComponent: BoxerTileComponent,
    },
    data() {
        return {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
        };
    },
    methods: {
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
