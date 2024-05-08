<template>
  <h3 class="mb-4">Fight Card</h3>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Red</th>
        <th scope="col">Blue</th>
        <th scope="col"></th>
        <th scope="col"></th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fight, index) in fightCard" :key="index">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ getBoxerDisplayName(fight.boxer1) }}</td>
        <td>{{ getBoxerDisplayName(fight.boxer2) }}</td>
        <td>
          <img v-if="fight.boxer1.attributes.gender == Gender.MALE" src="./assets/icons/male.svg" />
          <img v-if="fight.boxer1.attributes.gender == Gender.FEMALE" src="./assets/icons/female.svg" />
        </td>
        <td>
          <span v-for="modalityError in fight.modalityErrors">
            <ModalityError :modalityError="modalityError"></ModalityError>
          </span>
        </td>
        <td>
          <button @click="removeFromFightCardByIndex(index)" class="btn btn-danger btn-sm ms-2">
            <i class="bi bi-person-dash-fill"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from './types/boxing.d'
import { ModalityError, ModalityErrorType } from './types/modality.d'
import { BeaModality } from './fightModality/BeaModality'
import ModalityErrorView from "./ModalityErrorView.vue"
export default {
  props: ['fightCard'],
  components: {
    ModalityErrorView
  },
  data() {
    return {
      Gender: Gender,
    }
  },
  methods: {
    getBoxerDisplayName(boxer: Boxer) {
      return `${boxer.attributes.lastName} ${boxer.attributes.firstName}`;
    },
    removeFromFightCardByIndex(index: number): void {
      // Remove fight from the fight card
      this.fightCard.splice(index, 1);
    },
  }
}
</script>
