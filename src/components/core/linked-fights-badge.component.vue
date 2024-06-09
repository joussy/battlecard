<template>
  <span
    class="badge ms-2"
    :class="{
      'text-bg-success': store.getNbFightsForBoxer(boxer) < 2,
      'text-bg-warning': store.getNbFightsForBoxer(boxer) == 2,
      'text-bg-danger': store.getNbFightsForBoxer(boxer) > 2,
      'd-none': store.getNbFightsForBoxer(boxer) < 1
    }"
  >
    {{ store.getNbFightsForBoxer(boxer) }}
    <i class="bi bi-link" />
  </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';

import { store } from '@/composables/fight.composable';
import { Boxer } from '@/types/boxing';
import { ModalityError } from '@/types/modality';

export default defineComponent({
    props: {
        boxer:{
            type: Object as PropType<Boxer>,
            required: true
        },
        modalityError:{
            type: Object as PropType<ModalityError>,
            required: false,
            default: null
        }
    },
    data() {
        return {
            store
        };
    }
});
</script>