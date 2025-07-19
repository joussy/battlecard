<template>
    <div class="d-flex align-items-center menu-card-tools mb-3">
        <div class="flex-grow-1"></div>
        <button
            type="button"
            class="btn btn-outline-secondary ms-2"
            data-bs-toggle="modal"
            data-bs-target="#todoShareModal"
        >
            <i class="me-1 bi bi-share" />
            Share
        </button>
    </div>
    <div class="border border-light-subtle rounded-3 p-1">
        <FightCardGridComponent
            :fight-card="fightCard"
            :edition-mode="false"
        />
        <div
            v-if="fightCard.length == 0"
            class="justify-content-center m-4 text-center"
        >
            <div class="mb-4"><i>The fight card is empty</i></div>
            <div>Wait for fights to be added by the owner of the tournament</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Fight } from "@/types/boxing.d"
import FightCardGridComponent from "./fight-card/fight-card-grid.component.vue"
import { useFightStore } from "@/stores/fight.store"
import { useUiStore } from "@/stores/ui.store"
import { useBoxerStore } from "@/stores/boxer.store"
import { useTournamentStore } from "@/stores/tournament.store"
import apiManager from "@/managers/api.manager"
import ApiAdapter from "@/adapters/api.adapter"

export default {
    components: {
        FightCardGridComponent,
    },
    data() {
        return {
            fightStore: useFightStore(),
            uiStore: useUiStore(),
            boxerStore: useBoxerStore(),
            tournamentStore: useTournamentStore(),
            editionMode: false,
            fightCard: [] as Fight[],
            roToken: null as string | null,
        }
    },
    async mounted() {
        this.roToken = this.$route.params.roToken as string
        console.log("Token from route:", this.roToken)
        const sharedFightCardGet = await apiManager.getFightsByFightCardToken(this.roToken)
        this.fightCard = sharedFightCardGet.fights.map((f) => ApiAdapter.toFight(f))
    },
    methods: {},
}
</script>
