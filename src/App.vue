<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 class="">Boxing Matchup</h1>
        <button @click="expandAll()" class="btn btn-primary mb-3">
          Collapse/Expand
        </button>
        <div class="card" v-for="(boxer, index) in boxers" :key="boxer.name">
          <div
            class="card-header"
            role="tab"
            @click="toggleCollapse(index)"
            :class="{ collapsed: !boxer.collapsed }"
          >
            <i
              class="bi"
              :class="
                boxer.collapsed ? 'bi-arrows-collapse' : 'bi-chevron-expand'
              "
            ></i>
            {{ boxer.name }}
            <span class="badge bg-primary rounded-pill">{{
              boxer.opponents.length
            }}</span>
          </div>
          <div
            :id="'collapse-' + index"
            v-show="!boxer.collapsed"
            class="collapse"
            :class="{ show: !boxer.collapsed }"
          >
            <div class="card-body">
              <ul class="list-group">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="opponent in getPotentialOpponents(boxer)"
                  :key="opponent.name"
                >
                  <span>
                    {{ opponent.name }} -
                    <span
                      class="badge"
                      :class="
                        canCompete(boxer, opponent) ? 'bg-success' : 'bg-danger'
                      "
                    >
                      {{
                        canCompete(boxer, opponent)
                          ? "Éligible"
                          : "Non Éligible"
                      }}
                    </span>
                  </span>
                  <button
                    v-if="canCompete(boxer, opponent)"
                    @click="addToFightCard(boxer, opponent)"
                    class="btn btn-primary"
                  >
                    <i class="bi bi-person-plus-fill"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2 class="mt-5">Fight Card</h2>
        <ul class="list-group">
          <li
            v-for="(fight, index) in fightCard"
            :key="index"
            class="list-group-item"
          >
            {{ fight.boxer1.name }} vs {{ fight.boxer2.name }}
            <button
              @click="removeFromFightCard(index)"
              class="btn btn-danger btn-sm ms-2"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
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
