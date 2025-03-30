<template>
    <div v-if="boxer != null">
        <div class="d-flex justify-content-center align-items-center pb-1">
            <router-link
                :to="{ name: 'selector' }"
                class="nav-link text-center"
            >
                <i class="bi bi-arrow-left-circle fs-2"></i>
            </router-link>
            <h5 class="ps-2 card-title fw-bold flex-fill">
                {{ boxer.attributes.lastName }} {{ boxer.attributes.firstName }}
            </h5>
        </div>
        <div class="card mb-3">
            <div class="card shadow-lg rounded">
                <div class="card-body p-1 p-md-3">
                    <div class="row">
                        <p class="col-md-6 mb-1">
                            <Icon name="birthday-cake"></Icon>
                            {{ getBirthDateAndAge(boxer) }}
                        </p>
                        <p class="col-md-6 mb-1">
                            <i class="bi bi-person-vcard"></i> {{ boxer.attributes.license }} -
                            {{ boxer.attributes.category }}
                        </p>
                        <p class="col-md-6 mb-1"><i class="bi bi-house-fill"></i> {{ boxer?.attributes.club }}</p>
                        <p class="col-md-6 mb-1"><Icon name="scale"></Icon> {{ boxer.attributes.weight }} kg</p>
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Boxer, Gender, Opponent } from "@/types/boxing.d"
import { ModalityErrorType } from "@/types/modality.d"
import OpponentTileComponent from "@/components/opponent-tile.component.vue"
import IconComponent from "@/components/core/icon.component.vue"

import fightService from "@/services/fight.service"
import { uiStore } from "@/composables/ui.composable"
import { differenceInYears, format } from "date-fns"

export default defineComponent({
    components: {
        OpponentTileComponent: OpponentTileComponent,
        Icon: IconComponent,
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
