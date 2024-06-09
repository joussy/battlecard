<template>
  <form>
    <div class="mb-3">
      <label 
        for="lastname" 
        class="form-label"
      >
        Last Name
      </label>
      <input 
        id="lastname"
        type="text"
        class="form-control"
      >
    </div>
    <div class="mb-3">
      <label 
        for="firstname" 
        class="form-label"
      >
        First Name
      </label>
      <input 
        id="firstname"
        type="text"
        class="form-control"
      >
    </div>
    <div class="mb-3">
      <div class="btn-group" role="group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio1">Radio 1</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio2">Radio 2</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio3">Radio 3</label>
      </div>
    </div>
  </form>
</template>
  
<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Gender, Boxer } from '@/types/boxing.d'
import { ModalityErrorType } from '@/types/modality.d'

import { store } from '@/composables/fight.composable';

export default defineComponent({
    components: {
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
    },
});
</script>
