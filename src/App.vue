<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card">
          <div class="card-header"><i class="bi bi-gear-fill mr-1"></i>Options</div>
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-clipboard mr-2"></i>Import from clipboard
            </h5>
            <p class="card-text">
            <p>Nom | Prénom | Combats | Sexe | Poids | Club</p>
            <textarea class="d-block w-50 mb-2" v-model="clipboard" />
            <button class="btn btn-primary" @click="processClipboard()">Import</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="d-flex">
          <h3 class="flex-grow-1">Fighters</h3>
          <button @click="expandAll()" class="btn btn-secondary mb-3 ml-2">
            <i class="bi bi-chevron-down"></i>
            /
            <i class="bi bi-chevron-right"></i>
          </button>
          <button @click="clear()" class="btn btn-danger mb-3 ml-2">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card" v-for="(boxer, index) in boxers" :key="boxer.attributes.id">
          <div class="card-header d-flex" role="tab" @click="toggleCollapse(index)"
            :class="{ collapsed: !boxer.collapsed }">
            <span class="flex-grow-1">
              <i class="bi" :class="boxer.collapsed ? 'bi-chevron-down' : 'bi-chevron-right'
                "></i>
                <span class="ml-2 mr-1">
                <img v-if="boxer.attributes.gender == Gender.MALE" src="./assets/icons/male.svg" />
                <img v-if="boxer.attributes.gender == Gender.FEMALE" src="./assets/icons/female.svg" />
            </span>
              {{ getBoxerDisplayName(boxer) }}
            </span>
            <span>
              <span v-if="isInFightCard(boxer)" class="badge" :class="{ 
                'bg-success': getNbFightsForBoxer(boxer) < 2,
                'bg-warning': getNbFightsForBoxer(boxer) == 2,
                'bg-danger': getNbFightsForBoxer(boxer) > 2
              }">
                {{ getNbFightsForBoxer(boxer) }}
                <i class="bi bi-link"></i>
              </span>
              <span class="badge bg-light ml-2">
                🥊
                {{ boxer.opponents.filter(o => o.isEligible).length }}/{{ boxer.opponents.length }}</span>
            </span>
          </div>
          <div :id="'collapse-' + index" v-show="!boxer.collapsed" class="collapse" :class="{ show: !boxer.collapsed }">
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item d-flex" :class="{'list-group-item-danger': !opponent.isEligible}"
                 v-for="opponent in boxer.opponents">
                  <span class="flex-grow-1">
                    {{ getBoxerDisplayName(opponent.boxer) }}
                    <!-- <span v-if="opponent.isEligible" class="badge bg-success">
                      Éligible
                    </span> -->
                    <span v-for="modalityError in opponent.modalityErrors">
                      <ModalityError :modalityError="modalityError"></ModalityError>
                    </span>
                  </span>
                  <span class="">
                    <button v-if="canCompete(boxer, opponent.boxer)" @click="addToFightCard(boxer, opponent.boxer)"
                      class="btn btn-success btn-sm">
                      <i class="bi bi-person-plus-fill"></i>
                    </button>
                    <button v-if="isCompeting(boxer, opponent.boxer)" @click="removeFromFightCard(boxer, opponent.boxer)"
                      class="btn btn-danger btn-sm">
                      <i class="bi bi-person-dash-fill"></i>
                    </button>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <FightCardView :fightCard="fightCard"></FightCardView>
        <ClubStatisticsView :boxers="boxers" :fightCard="fightCard"></ClubStatisticsView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from './types/boxing.d'
import { ModalityError, ModalityErrorType } from './types/modality.d'
import { BeaModality } from './fightModality/BeaModality'
import ModalityErrorView from "./ModalityErrorView.vue"
import FightCardView from "./FightCardView.vue"
import ClubStatisticsView from "./ClubStatisticsView.vue"
export default {
  components: {
    ModalityErrorView,
    FightCardView,
    ClubStatisticsView
  },
  data() {
    let ret: BoxingData = {
      boxers: [
        // new Boxer(1, "", "Boxer 1", new Date(), [], 1, 1, 1, 50, "", "CPB"), 
      ],
      fightCard: [],
      modality: new BeaModality(),
      // Nom	Prénom	Combats		Sexe	Poids	Club
      clipboard: `
JOSHUA	Anthony	1	H	50	Club1
FURY	Tyson	2	H	51	Club2
TYSON	Mike	3	H	52	Club3
STARR	Joey	4	H	53	Club4
MONTANA	Tony	5	H	90	Club5
NICOLSON	Skye	6	F	55	Club6
TAYLOR	Katie	7	F	56	Club7
SERRANO	Amanda	8	F	57	Club1
      `.trim(),
      Gender: Gender,
      ModalityErrorType: ModalityErrorType,
    };

    // this.fightCard = JSON.parse(localStorage.getItem('fightCard') || "{}");

    return ret;
  },
  mounted() {
    // if (localStorage.boxers) {
    //   this.boxers = JSON.parse(localStorage.boxers) || [];
    //   this.boxers = this.boxers.map(b => b.opponents)
    // }
    // if (localStorage.fightCard) {
    //   this.fightCard = JSON.parse(localStorage.fightCard) || [];
    // }
    if (localStorage.boxing) {
      const boxingStorage: BoxingStorage = JSON.parse(localStorage.boxing) || {};
      this.boxers = boxingStorage.boxers.map<Boxer>((b) => {
        return { attributes: b, collapsed: true, opponents: [] } as Boxer;
      });
      this.computeBoxerOpponents();
    }
  },
  watch: {
    boxers(newBoxers: Boxer[]) {
      // let toStore = newBoxers.map<Boxer>((b) => {
      //   let b1 = {...b};
      //   b1.opponents = [];
      //   return b1
      // });
    },
    // fightCard: {
    //   handler(newFightCard) {
    //     (localStorage.boxingStorage as BoxingStorage).fights
    //   }, deep: true
    // }
  },
  methods: {
    getOpponentModalityErrors(boxer: Boxer, opponent: Boxer): ModalityError[] {
      return this.modality.getModalityProblems(boxer.attributes, opponent.attributes);
    },
    canCompete(boxer1: Boxer, boxer2: Boxer): boolean {
      return !this.isCompeting(boxer1, boxer2);
    },
    getFightId(boxer1: Boxer, boxer2: Boxer): number | null {
      const index = this.fightCard.findIndex(
        (fight: Fight) =>
          (fight.boxer1.attributes.id === boxer1.attributes.id && fight.boxer2.attributes.id === boxer2.attributes.id) ||
          (fight.boxer1.attributes.id === boxer2.attributes.id && fight.boxer2.attributes.id === boxer1.attributes.id),
      );
      return index < 0 ? null : index;
    },
    isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
      const index = this.getFightId(boxer1, boxer2);

      return index != null;
    },
    addToFightCard(boxer1: Boxer, boxer2: Boxer) {
      // Check if the fight already exists before adding to the fight card

      if (!this.isCompeting(boxer1, boxer2)) {
        this.fightCard.push({ boxer1, boxer2, modalityErrors: this.getOpponentModalityErrors(boxer1, boxer2) });
      }
    },
    removeFromFightCardByIndex(index: number): void {
      // Remove fight from the fight card
      this.fightCard.splice(index, 1);
    },
    toggleCollapse(index: number): void {
      this.boxers[index].collapsed = !this.boxers[index].collapsed;
    },
    expandAll() {
      let collapse = true;
      if (this.boxers[0]?.collapsed) {
        collapse = false;
      }
      for (let [index, boxer] of this.boxers.entries()) {
        this.boxers[index].collapsed = collapse;
      }
    },
    removeFromFightCard(boxer1: Boxer, boxer2: Boxer): void {
      let index = this.getFightId(boxer1, boxer2);
      if (index != null) {
        this.removeFromFightCardByIndex(index);
      }
    },
    isInFightCard(boxer: Boxer): boolean {
      return this.getNbFightsForBoxer(boxer) > 0
    },
    tsvToJson(tsvText: string, headers: string[]): object {
      //Split all the text into seperate lines on new lines and carriage return feeds
      var allTextLines = tsvText.split(/\r\n|\n/);
      //Split per line on tabs and commas
      // var headers = allTextLines[0].split(/\t|,/);
      var lines = [];

      for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(/\t|,|;/);

        var row: any = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j]] = data[j];
        }
        lines.push(row);
      }

      return lines;
    },
    computeBoxerOpponents() {
      for (let [index, boxer] of this.boxers.entries()) {
        boxer.opponents = this.boxers
          .map((b) => <Opponent>{
            weightDifference: Math.abs(boxer.attributes.weight - b.attributes.weight),
            boxer: b,
            modalityErrors: this.getOpponentModalityErrors(boxer, b),
            isEligible: this.getOpponentModalityErrors(boxer, b).length == 0
          })
          .filter(o =>
            !o.modalityErrors.some(modalityError => [ModalityErrorType.SAME_CLUB, ModalityErrorType.SAME_ID, ModalityErrorType.OPPOSITE_GENDER].includes(modalityError.type)));
      }
    },
    processClipboard() {
      let ret: any = this.tsvToJson(this.clipboard, [
        'lastName',
        'firstName',
        'nbFights',
        'gender',
        'weight',
        'club'
      ])
      this.clear();
      for (const [index, entry] of ret.entries()) {
        this.boxers.push({
          collapsed: true,
          opponents: [],
          attributes: {
            id: index,
            lastName: entry.lastName,
            firstName: entry.firstName,
            birthDate: new Date(entry.birthDate),
            nbFights: parseInt(entry.nbFights),
            category: "",
            club: entry.club,
            weight: parseInt(entry.weight),
            gender: entry.gender == 'F' ? Gender.FEMALE : Gender.MALE
          }
        });
      }
      this.computeBoxerOpponents();
    },
    getNbFightsForBoxer(boxer: Boxer) {
      return this.fightCard.filter(f => f.boxer1.attributes.id == boxer.attributes.id || f.boxer2.attributes.id == boxer.attributes.id).length
    },
    getBoxerDisplayName(boxer: Boxer) {
      return `${boxer.attributes.lastName} ${boxer.attributes.firstName}`;
    },
    clear(): void {
      this.boxers = [];
      this.fightCard = [];
    }
  },
};
</script>

<style>
/* Add your component-specific styles here */
</style>
