<template>
  <h3 class="mb-4">
    Fight Card
  </h3>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">
          #
        </th>
        <th scope="col">
          Red
        </th>
        <th scope="col">
          Blue
        </th>
        <th scope="col" />
        <th scope="col" />
        <th scope="col" />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(fight, index) in store.fightCard"
        :key="index"
      >
        <th scope="row">
          {{ index + 1 }}
        </th>
        <td>{{ store.getBoxerDisplayName(fight.boxer1) }}</td>
        <td>{{ store.getBoxerDisplayName(fight.boxer2) }}</td>
        <td>
          <img
            v-if="fight.boxer1.attributes.gender == Gender.MALE"
            src="@/assets/icons/male.svg"
          >
          <img
            v-if="fight.boxer1.attributes.gender == Gender.FEMALE"
            src="@/assets/icons/female.svg"
          >
        </td>
        <td>
          <span v-for="modalityError in fight.modalityErrors">
            <ModalityErrorComponent :modality-error="modalityError" />
          </span>
        </td>
        <td>
          <button
            class="btn btn-outline-danger btn-sm ms-2"
            @click="store.removeFromFightCardByIndex(index)"
          >
            <i class="bi bi-person-dash-fill" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Gender } from '@/types/boxing.d'
import ModalityErrorComponent from "@/components/core/modality-error.component.vue"
import { store } from '@/composables/fight.composable'
export default {
  components: {
    ModalityErrorComponent: ModalityErrorComponent
  },
  data() {
    return {
      Gender: Gender,
      store
    }
  },
  methods: {
  }
}
</script>
