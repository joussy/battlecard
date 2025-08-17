<template>
    <!-- Share Modal -->
    <div
        id="matchupModal"
        ref="matchupModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="matchupModalLabel"
                        class="modal-title"
                    >
                        Matchup
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body p-3">
                    <div class="matchup-header d-flex justify-content-between">
                        <button
                            class="btn btn-primary"
                            :disabled="!canGoPrevious"
                            @click="goToPrevious"
                        >
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <div class="btn btn-success"><IconComponent name="headgear"></IconComponent> Add/Remove</div>
                        <button
                            class="btn btn-primary"
                            :disabled="!canGoNext"
                            @click="goToNext"
                        >
                            <i class="bi bi-chevron-right"></i>
                        </button>
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
</template>

<script lang="ts">
import { useFightStore } from "@/stores/fight.store"
import { Fight } from "@/types/boxing"
import { Modal } from "bootstrap"
import IconComponent from "@/components/core/icon.component.vue"
import MatchupDetailsComponent from "@/components/tournament/matchup-details.component.vue"

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
        // Keep a reference to the modal instance
        this.modal = Modal.getOrCreateInstance(this.$refs.matchupModal as HTMLElement)
        this.modal.show()

        this.loadMatchups()
    },
    beforeUnmount() {
        // Close modal when component is destroyed
        if (this.modal) {
            this.modal.hide()
        }
    },
    methods: {
        loadMatchups() {
            this.fights = this.fightStore.fights
            this.currentFightIndex = 0
            this.fight = this.fights.length > 0 ? this.fights[0] : null
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
    },
}
</script>

<style scoped></style>
