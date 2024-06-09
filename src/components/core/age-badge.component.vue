<template>
  <span
    class="badge ms-2"
    :class="{
      'text-bg-danger': modalityError,
      'text-bg-light': !modalityError,
    }"
  >
    <img
      src="@/assets/icons/birthday-cake.svg"
      height="16"
    >
    {{ getBoxerAge() }}
  </span>
</template>

<script lang="ts">
import { Boxer } from '@/types/boxing';
import { ModalityError } from '@/types/modality';
import { PropType, defineComponent } from 'vue';
import {differenceInYears} from 'date-fns';

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
    methods: {
      getBoxerAge(): number {
        return differenceInYears(new Date(), this.boxer.attributes.birthDate);
      }
    }
});
</script>