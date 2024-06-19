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
            <tr
                v-for="(club, index) in getClubFighters()"
                :key="index"
            >
                <td>{{ club.clubName }}</td>
                <td>{{ club.available }}</td>
                <td>{{ club.selected }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { ClubFighters } from "@/types/boxing.d"
import { store } from "@/composables/fight.composable"
import { groupBy } from "@/utils/arrayUtils"

export default {
    components: {},
    data() {
        return {
            store,
        }
    },
    methods: {
        getClubFighters(): ClubFighters[] {
            const clubs = groupBy(this.store.boxers, (x) => x.attributes.club)
            const clubFighters: ClubFighters[] = Array.from(clubs.keys()).map(function (clubKey: string) {
                return {
                    available: clubs.get(clubKey)?.length ?? 0,
                    selected: store.fightCard.filter(
                        (f) => f.boxer1.attributes.club == clubKey || f.boxer2.attributes.club == clubKey
                    ).length,
                    clubName: clubKey,
                } as ClubFighters
            })
            return clubFighters
        },
    },
}
</script>
