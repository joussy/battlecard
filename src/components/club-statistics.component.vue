<template>
  <h3 class="mb-4">Clubs</h3>
  <table class="table table-sm">
    <thead>
      <tr>
        <th scope="col">Club</th>
        <th scope="col">Available</th>
        <th scope="col">Fights</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(club, index) in getClubFighters()" :key="index">
        <td>{{ club.clubName }}</td>
        <td>{{ club.available }}</td>
        <td>{{ club.selected }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from '@/types/boxing.d'
export default {
  // props: ['fightCard', 'boxers'],
  props: {
    fightCard:{
      type: Object as () => Fight[],
    },
    boxers:{
      type: Object as () => Boxer[],
    }
  },
  components: {
  },
  data() {
    return {};
  },
  methods: {
    groupBy<T>(list: T[], keyGetter: (x: T) => any): Map<string, T[]> {
      const map = new Map();
      list.forEach((item: any) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
    getClubFighters(): ClubFighters[] {
      const clubs = this.groupBy(this.boxers as Boxer[], (x) => x.attributes.club);
      const thisObj = this;
      const clubFighters: ClubFighters[] = Array.from(clubs.keys()).map(function (clubKey: string) {
        return {
          available: clubs.get(clubKey)?.length ?? 0,
          selected: thisObj.fightCard?.filter(f => f.boxer1.attributes.club == clubKey || f.boxer2.attributes.club == clubKey).length,
          clubName: clubKey,
        } as ClubFighters
      });
      return clubFighters;
    }
  },
};
</script>

<style>
/* Add your component-specific styles here */
</style>
