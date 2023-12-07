<template>
  <div class="container mt-2">
    <div class="row">
      <div class="col-md-12 mb-4">
        <div class="card">
          <div class="card-header"><i class="bi bi-gear-fill"></i>Options</div>
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
          <button @click="expandAll()" class="btn btn-primary mb-3 ml-2">
            <i class="bi bi-chevron-down"></i>
            /
            <i class="bi bi-chevron-right"></i>
          </button>
          <button @click="clear()" class="btn btn-primary mb-3 ml-2">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="card" v-for="(boxer, index) in boxers" :key="boxer.id">
          <div class="card-header d-flex" role="tab" @click="toggleCollapse(index)"
            :class="{ collapsed: !boxer.collapsed }">
            <span class="flex-grow-1">
              <i class="bi" :class="boxer.collapsed ? 'bi-chevron-down' : 'bi-chevron-right'
                "></i>
              {{ getBoxerDisplayName(boxer) }}
            </span>
            <span>
              <span v-if="isInFightCard(boxer)" class="badge bg-success">
                {{ getNbFightsForBoxer(boxer) }}
                <i class="bi bi-link"></i>
              </span>
              <span class="badge bg-secondary ml-2">
                🥊
                {{ boxer.opponents.length }}</span>
            </span>
          </div>
          <div :id="'collapse-' + index" v-show="!boxer.collapsed" class="collapse" :class="{ show: !boxer.collapsed }">
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item d-flex"
                  v-for="opponent in getPotentialOpponents(boxer)" :key="opponent.id">
                  <span class="flex-grow-1">
                    {{ getBoxerDisplayName(opponent) }} -
                    <span class="badge" :class="canCompete(boxer, opponent) ? 'bg-success' : 'bg-danger'
                      ">
                      {{
                        canCompete(boxer, opponent)
                        ? "Éligible"
                        : "Non Éligible"
                      }}
                    </span>
                  </span>
                  <span class="">
                    <button v-if="canCompete(boxer, opponent) && !isCompeting(boxer, opponent)" @click="addToFightCard(boxer, opponent)"
                      class="btn btn-success btn-sm">
                      <i class="bi bi-person-plus-fill"></i>
                    </button>
                    <button v-if="isCompeting(boxer, opponent)" @click="removeFromFightCard(boxer, opponent)"
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
        <h3 class="mb-4">Fight Card</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Red</th>
              <th scope="col">Blue</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fight, index) in fightCard" :key="index">
              <th scope="row"></th>
              <td>{{ getBoxerDisplayName(fight.boxer1) }}</td>
              <td>{{ getBoxerDisplayName(fight.boxer2) }}</td>
              <td>
                <button @click="removeFromFightCardByIndex(index)" class="btn btn-danger btn-sm ms-2">
                  <i class="bi bi-person-dash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { Boxer, Gender, Fight, BoxingData } from './types/boxing.d'

export default {
  data() {
    let ret: BoxingData = {
      boxers: [
        // new Boxer(1, "", "Boxer 1", new Date(), [], 1, 1, 1, 50, "", "CPB"), 
      ],
      fightCard: [],
      // Nom	Prénom	Combats		Sexe	Poids	Club
      clipboard: `
MALIK	Abdel	1	H	50	CPB
SOLAAR	Claude	0	H	51	CPB
LAMAR	Kendrik	2	H	52	CPB
STARR	Joey	4	H	53	CPB
MONTANA	Tony	0	H	90	CPB
AMERICA	Captain	0	H	55	CPB
ALI	Mohammed	0	H	56	CPB
FRAIZER	Joe	0	F	57	CPB
      `.trim(),
    };

    // this.fightCard = JSON.parse(localStorage.getItem('fightCard') || "{}");

    return ret;
  },
  mounted() {
    if (localStorage.boxers) {
      this.boxers = JSON.parse(localStorage.boxers) || [];
    }
    if (localStorage.fightCard) {
      this.fightCard = JSON.parse(localStorage.fightCard) || [];
    }
  },
  watch: {
    boxers(newBoxers) {
      localStorage.boxers = JSON.stringify(newBoxers);
    },
    fightCard: {
      handler(newFightCard) {
        localStorage.fightCard = JSON.stringify(newFightCard);
      }, deep: true
    }
  },
  methods: {
    computeCanCompete(boxer1: Boxer, boxer2: Boxer) {
      // Logic to check if boxers can compete
      return Math.abs(boxer1.weight - boxer2.weight) < 5;
    },
    canCompete(boxer1: Boxer, boxer2: Boxer) {
      // Logic to check if boxers can compete
      return boxer1.opponents.some((o) => o == boxer2.id);
    },
    getFightId(boxer1: Boxer, boxer2: Boxer): number | null {
      const index = this.fightCard.findIndex(
        (fight: Fight) =>
          (fight.boxer1.id === boxer1.id && fight.boxer2.id === boxer2.id) ||
          (fight.boxer1.id === boxer2.id && fight.boxer2.id === boxer1.id),
      );
      return index < 0 ? null : index;
    },
    isCompeting(boxer1: Boxer, boxer2: Boxer): boolean {
      const index = this.getFightId(boxer1, boxer2);

      return index != null;
    },
    getPotentialOpponents(boxer: Boxer) {
      // Return potential opponents for the given boxer
      return this.boxers.filter((b) => b.id !== boxer.id);
    },
    addToFightCard(boxer1: Boxer, boxer2: Boxer) {
      // Check if the fight already exists before adding to the fight card

      if (!this.isCompeting(boxer1, boxer2)) {
        this.fightCard.push({ boxer1, boxer2 });
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
          id: index,
          lastName: entry.lastName,
          firstName: entry.firstName,
          birthDate: new Date(entry.birthDate),
          opponents: [],
          nbFights: parseInt(entry.nbFights),
          category: "",
          club: entry.club,
          collapsed: true,
          weight: parseInt(entry.weight),
          gender: entry.gender == 'F' ? Gender.FEMALE : Gender.MALE
        });
      }
      for (let [index, boxer] of this.boxers.entries()) {
        boxer.opponents = this.boxers
          .filter(
            (b) => b.id != boxer.id && this.computeCanCompete(b, boxer),
          )
          .map((b) => b.id);
      }
    },
    getNbFightsForBoxer(boxer: Boxer) {
      return this.fightCard.filter(f => f.boxer1.id == boxer.id || f.boxer2.id == boxer.id).length
    },
    getBoxerDisplayName(boxer: Boxer) {
      return `${boxer.lastName} ${boxer.firstName}`;
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
