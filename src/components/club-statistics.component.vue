<template>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">Club</th>
                <th colspan="2">Selection</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(club, index) in getClubFighters()"
                :key="index"
            >
                <td>{{ club.clubName }}</td>
                <td class="w-50">
                    <div class="d-flex">
                        <span>{{ club.selected }} / {{ club.available }}</span>
                        <div
                            class="progress flex-fill ms-3"
                            role="progressbar"
                            style="height: 23px"
                        >
                            <div
                                class="progress-bar"
                                :class="{
                                    'bg-danger': club.selected < 2,
                                    'bg-warning': club.selected > 1 && club.selected < 4,
                                    'bg-success': club.selected > 3,
                                }"
                                :style="{
                                    width: `${(club.selected * 100) / club.available}%`,
                                }"
                            >
                                {{ club.selected }}
                            </div>
                        </div>
                    </div>
                </td>
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
