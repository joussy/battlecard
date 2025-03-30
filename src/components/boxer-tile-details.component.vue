<template>
    <div
        v-if="boxer != null"
        class="card mb-3"
    >
        <div class="card shadow-lg rounded">
            <div class="card-body p-1 p-md-3">
                <h5 class="card-title fw-bold text-center">
                    {{ boxer.attributes.lastName }} {{ boxer.attributes.firstName }}
                </h5>
                <h6 class="text-muted text-center">
                    <span class="fw-semibold">{{ boxer.attributes.license }} - {{ getBirthDateAndAge(boxer) }}</span>
                </h6>
                <hr class="m-0 m-md-2" />
                <div class="row text-md-center">
                    <p class="col-md-4 mb-1"><strong>Club:</strong> {{ boxer?.attributes.club }}</p>
                    <p class="col-md-4 mb-1"><strong>Weight:</strong> {{ boxer.attributes.weight }} kg</p>
                    <p class="col-md-4 mb-1"><strong>Category:</strong> {{ boxer.attributes.category }}</p>
                </div>
            </div>
        </div>
    </div>
    <h6 class="ps-1">Available opponents</h6>
    <div>
        <div class="ps-0 pe-0 pt-0 pb-0">
            <div v-for="opponent in getOpponentsToDisplay()">
                <OpponentTileComponent
                    :boxer="boxer"
                    :opponent="opponent.boxer"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Boxer, Gender, Opponent } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import OpponentTileComponent from "@/components/opponent-tile.component.vue"

import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"
import { differenceInYears, format } from "date-fns"

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
    },
    setup() {},
    data() {
        return {
            fightStore: fightService.store(),
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
            fightService: fightService,
        }
    },
    computed: {
        boxer() {
            const boxerId = this.$route.params.id
            return this.fightStore.boxers.find((b) => b.attributes.id == boxerId)
        },
    },
    mounted() {},
    methods: {
        getOpponentsToDisplay(): Readonly<Opponent[]> {
            return this.boxer?.opponents.filter((o) => !uiStore.hideNonMatchableOpponents || o.isEligible) ?? []
        },
        getBirthDateAndAge(boxer: Boxer): string {
            const age = differenceInYears(new Date(), boxer.attributes.birthDate)
            const birthDate = format(boxer.attributes.birthDate, "dd/MM/yyyy")
            return `${birthDate} (${age})`
        },
    },
})
</script>
