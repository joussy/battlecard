<template>
  <b-row>
    <b-col>
      <h1 class="mb-4">Boxing Matchup</h1>
      <b-button @click="expandAll()">Collapse/Expand</b-button>
      <b-card
        v-for="(boxer, index) in boxers"
        :key="boxer.name"
        no-body
        class="mb-2"
      >
        <b-card-header
          header-tag="header"
          role="tab"
          @click="toggleCollapse(index)"
        >
          <b-icon
            :icon="boxer.collapsed ? 'arrows-collapse' : 'chevron-expand'"
          ></b-icon>
          {{ boxer.name }}
          <span class="badge bg-primary rounded-pill">{{
            boxer.opponents.length
          }}</span>
        </b-card-header>
        <b-collapse
          :id="'collapse-' + index"
          v-model="boxer.collapsed"
          class="mt-2"
        >
          <b-card-body>
            <ul class="list-group">
              <li
                class="list-group-item d-flex"
                v-for="opponent in getPotentialOpponents(boxer)"
                :key="opponent.name"
              >
                <span class="p-2 flex-grow-1">
                  {{ opponent.name }} -
                  <b-badge
                    :variant="
                      canCompete(boxer, opponent) ? 'success' : 'danger'
                    "
                  >
                    {{
                      canCompete(boxer, opponent) ? "Éligible" : "Non Éligible"
                    }}
                  </b-badge>
                </span>
                <b-button
                  class="p-2"
                  v-if="canCompete(boxer, opponent)"
                  @click="addToFightCard(boxer, opponent)"
                >
                  <b-icon icon="person-plus-fill"></b-icon>
                </b-button>
              </li>
            </ul>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-col>
    <b-col md="6">
      <h2 class="mt-5">Fight Card</h2>
      <b-list-group>
        <b-list-group-item v-for="(fight, index) in fightCard" :key="index">
          {{ fight.boxer1.name }} vs {{ fight.boxer2.name }}
          <b-button @click="removeFromFightCard(index)">Remove</b-button>
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data() {
    let ret = {
      boxers: [
        { name: "Boxer 1", weightClass: "Middleweight", experience: 15 },
        { name: "Boxer 2", weightClass: "Welterweight", experience: 10 },
        { name: "New Boxer", weightClass: "Middleweight", experience: 18 },
        { name: "Boxer 3", weightClass: "Lightweight", experience: 12 }, // Additional boxers
        { name: "Boxer 4", weightClass: "Welterweight", experience: 13 },
        { name: "Boxer 5", weightClass: "Heavyweight", experience: 20 },
        { name: "Boxer 6", weightClass: "Middleweight", experience: 17 },
      ],
      fightCard: [],
    };
    for (let [index, boxer] of ret.boxers.entries()) {
      boxer.id = index;
    }
    for (let [index, boxer] of ret.boxers.entries()) {
      boxer.opponents = ret.boxers
        .filter((b) => b.id != boxer.id && this.computeCanCompete(b, boxer))
        .map((b) => b.id);
    }

    return ret;
  },
  mounted() {},
  methods: {
    computeCanCompete(boxer1, boxer2) {
      // Logic to check if boxers can compete
      return (
        boxer1.weightClass === boxer2.weightClass &&
        Math.abs(boxer1.experience - boxer2.experience) < 5
      );
    },
    canCompete(boxer1, boxer2) {
      // Logic to check if boxers can compete
      return boxer1.opponents.some((o) => o == boxer2.id);
    },
    getPotentialOpponents(boxer) {
      // Return potential opponents for the given boxer
      return this.boxers.filter((b) => b.name !== boxer.name);
    },
    addToFightCard(boxer1, boxer2) {
      // Check if the fight already exists before adding to the fight card
      const exists = this.fightCard.some(
        (fight) =>
          (fight.boxer1.name === boxer1.name &&
            fight.boxer2.name === boxer2.name) ||
          (fight.boxer1.name === boxer2.name &&
            fight.boxer2.name === boxer1.name),
      );

      if (!exists) {
        this.fightCard.push({ boxer1, boxer2 });
      }
    },
    removeFromFightCard(index) {
      // Remove fight from the fight card
      this.fightCard.splice(index, 1);
    },
    toggleCollapse(index) {
      this.boxers[index].collapsed = !this.boxers[index].collapsed;
      // console.log(this.boxers[index].collapsed)
    },
    expandAll() {
      for (let [index, boxer] of this.boxers.entries()) {
        this.toggleCollapse(index);
        console.log(boxer.name);
      }
    },
  },
};
</script>

<style>
/* Add your component-specific styles here */
</style>
