<template>
    <!-- Share Modal -->
    <div
        id="matchupModal"
        ref="matchupModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="matchupModalLabel"
                        class="modal-title"
                    >
                        <i class="bi bi-magic"></i>
                        Matchmaker
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body p-3">
                    <div v-if="!fight">
                        <h3>No matches available 😔</h3>
                        Add more boxers to the selector to find suitable pairings.
                    </div>
                    <div v-else>
                        <div>
                            <div class="matchup-header d-flex justify-content-between">
                                <button
                                    class="btn btn-primary"
                                    :disabled="!canGoPrevious"
                                    @click="goToPrevious"
                                >
                                    <i class="bi bi-chevron-left"></i>
                                </button>
                                <div
                                    v-if="fight && getRealFightId(fight) == null"
                                    class="btn btn-success"
                                    @click="addToFightCard(fight)"
                                >
                                    <IconComponent
                                        name="headgear"
                                        class="me-1"
                                    ></IconComponent
                                    >Add fight
                                </div>
                                <div
                                    v-if="fight && getRealFightId(fight) != null"
                                    class="btn btn-danger"
                                    @click="removeFromFightCard(fight)"
                                >
                                    <IconComponent
                                        name="headgear"
                                        class="me-1"
                                    ></IconComponent
                                    >Remove fight
                                </div>
                                <button
                                    class="btn btn-primary"
                                    :disabled="!canGoNext"
                                    @click="goToNext"
                                >
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center m-1">
                            Matchup {{ currentFightIndex + 1 }} of {{ fights.length }}
                        </div>
                        <div class="matchup-content mt-3">
                            <MatchupDetailsComponent
                                v-if="fight != null"
                                :fight="fight"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useFightStore } from "@/stores/fight.store"
import { Fight } from "@/types/boxing"
import { Modal } from "bootstrap"
import IconComponent from "@/components/shared/core/icon.component.vue"
import MatchupDetailsComponent from "@/components/tournament/matchup-details.component.vue"
import { useTournamentStore } from "@/stores/tournament.store"
import { FightOpenApi } from "@/api"
import ApiAdapter from "@/adapters/api.adapter"

export default {
    components: {
        IconComponent,
        MatchupDetailsComponent,
    },
    beforeRouteLeave(to, from, next) {
        // If you're using Vue Router
        if (this.modal) {
            this.modal.hide()
        }
        next()
    },
    props: {},
    data() {
        return {
            modal: null as Modal | null,
            fightStore: useFightStore(),
            tournamentStore: useTournamentStore(),
            fights: [] as Fight[],
            fight: null as Fight | null,
            currentFightIndex: 0,
        }
    },
    computed: {
        canGoPrevious(): boolean {
            return this.currentFightIndex > 0
        },
        canGoNext(): boolean {
            return this.currentFightIndex < this.fights.length - 1
        },
    },
    mounted() {
        const modalElement = this.$refs.matchupModal as HTMLElement
        // Keep a reference to the modal instance
        this.modal = Modal.getOrCreateInstance(modalElement as HTMLElement)
        modalElement.addEventListener("show.bs.modal", async () => {
            await this.loadMatchups()
        })
    },
    beforeUnmount() {
        // Close modal when component is destroyed
        if (this.modal) {
            this.modal.hide()
        }
    },
    methods: {
        async loadMatchups() {
            if (!this.tournamentStore.currentTournamentId) {
                console.error("No tournament selected")
                return
            }
            try {
                const apiFights = await FightOpenApi.getMatchups({
                    path: { tournamentId: this.tournamentStore.currentTournamentId },
                })
                if (apiFights) {
                    this.fights = apiFights.map(ApiAdapter.toFight)
                } else {
                    this.fights = []
                }
                this.currentFightIndex = 0
                this.fight = this.fights.length > 0 ? this.fights[0] : null
            } catch (error) {
                console.error("Error loading matchups:", error)
                this.fights = []
                this.fight = null
            }
        },
        goToPrevious() {
            if (this.canGoPrevious) {
                this.currentFightIndex--
                this.fight = this.fights[this.currentFightIndex]
            }
        },
        goToNext() {
            if (this.canGoNext) {
                this.currentFightIndex++
                this.fight = this.fights[this.currentFightIndex]
            }
        },
        addToFightCard(fight: Fight) {
            this.fightStore.addToFightCard(fight.boxer1, fight.boxer2)
        },
        removeFromFightCard(fight: Fight) {
            const realFightId = this.getRealFightId(fight)
            if (!realFightId) {
                console.error("No real fight ID found for the fight")
                return
            }
            this.fightStore.removeFromFightCard([realFightId])
        },
        getRealFightId(fight: Fight): string | null {
            return (
                this.fightStore.fights?.find(
                    (f) =>
                        (f.boxer1.id === fight.boxer1.id && f.boxer2.id === fight.boxer2.id) ||
                        (f.boxer1.id === fight.boxer2.id && f.boxer2.id === fight.boxer1.id)
                )?.id || null
            )
        },
    },
}
</script>

<style scoped></style>
