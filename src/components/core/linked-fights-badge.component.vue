<template>
  <span
    class="badge"
    :class="{
      'bg-success': store.getNbFightsForBoxer(boxer) < 2,
      'bg-warning': store.getNbFightsForBoxer(boxer) == 2,
      'bg-danger': store.getNbFightsForBoxer(boxer) > 2,
      'd-none': store.getNbFightsForBoxer(boxer) < 1
    }"
  >
    {{ store.getNbFightsForBoxer(boxer) }}
    <i class="bi bi-link" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { store } from '@/composables/fight.composable';

export default defineComponent({
    props: ['boxer', 'modalityError'],
    data() {
        return {
            store
        };
    }
});
</script>