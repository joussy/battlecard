<template>
  <span
    class="badge ml-2"
    :class="{
      'bg-danger': modalityError,
      'bg-light': !modalityError,
    }"
  >
    <img
      src="@/assets/icons/scale.svg"
      height="16"
    >
    {{ boxer.attributes.weight }}
  </span>
</template>

<script lang="ts">
import { Boxer } from '@/types/boxing';
import { ModalityError } from '@/types/modality';
import { PropType, defineComponent } from 'vue';

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
    }
});
</script>