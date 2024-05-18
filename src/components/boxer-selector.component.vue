<template>
    <div class="d-flex">
        <h3 class="flex-grow-1">Fighters</h3>
        <button @click="expandAll()" class="btn btn-secondary mb-3 ml-2">
            <i class="bi bi-chevron-down"></i>
            /
            <i class="bi bi-chevron-right"></i>
        </button>
        <button @click="store.clear()" class="btn btn-danger mb-3 ml-2">
            <i class="bi bi-trash"></i>
        </button>
    </div>
    <div class="card" v-for="(boxer, index) in store.boxers" :key="boxer.attributes.id">
        <div class="card-header d-flex pt-0 pb-1" role="tab" @click="toggleCollapse(index)" :class="{ collapsed: !boxer.collapsed }">
            <span>
                <i class="bi" :class="boxer.collapsed ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
            </span>
            <span class="ml-2 flex-grow-1">
                <div>
                    <span class="mr-1">
                        <img v-if="boxer.attributes.gender == Gender.MALE" src="@/assets/icons/male.svg" height="17" />
                        <img v-if="boxer.attributes.gender == Gender.FEMALE" src="@/assets/icons/female.svg" height="17" />
                    </span>
                    {{ store.getBoxerDisplayName(boxer) }}
                </div>
                <div>
                    {{ boxer.attributes.category }}
                </div>
            </span>
            <span>
             <div class="text-right">
                <span style="font-size: 14px;" class="font-italic">{{ boxer.attributes.club }}</span>
             </div>
             <div>
                    <span class="badge" :class="{
                        'bg-success': store.getNbFightsForBoxer(boxer) < 2,
                        'bg-warning': store.getNbFightsForBoxer(boxer) == 2,
                        'bg-danger': store.getNbFightsForBoxer(boxer) > 2,
                        'invisible': store.getNbFightsForBoxer(boxer) < 1
                    }">
                        {{ store.getNbFightsForBoxer(boxer) }}
                        <i class="bi bi-link"></i>
                    </span>
                    <span class="badge bg-light ml-2 pt-0 pb-0">
                        <img src="@/assets/icons/medal.svg" height="16" />
                        {{ boxer.attributes.nbFights }}
                    </span>
                    <span class="badge bg-light ml-2 pt-0 pb-0">
                        <img src="@/assets/icons/scale.svg" height="16" />
                        {{ boxer.attributes.weight }}
                    </span>
                    <span class="badge bg-light ml-2 pt-0 pb-0">
                        🥊
                        {{ boxer.opponents.filter(o => o.isEligible).length }}/{{ boxer.opponents.length }}
                    </span>
                </div>
            </span>
        </div>
        <div :id="'collapse-' + index" v-show="!boxer.collapsed" class="collapse" :class="{ show: !boxer.collapsed }">
            <div class="card-body">
                <ul class="list-group">
                    <li class="list-group-item d-flex" v-for="opponent in boxer.opponents">
                        <span class="flex-grow-1">
                            <span class="mr-1" :class="{ '	text-danger': !opponent.isEligible }">{{
                                store.getBoxerDisplayName(opponent.boxer) }}
                            </span>
                            <!-- <span v-if="opponent.isEligible" class="badge bg-success">
                        Éligible
                      </span> -->
                            <span v-for="modalityError in opponent.modalityErrors">
                                <ModalityErrorComponent :modalityError="modalityError"></ModalityErrorComponent>
                            </span>
                        </span>
                        <span class="">
                            <button v-if="store.canCompete(boxer, opponent.boxer)"
                                @click="store.addToFightCard(boxer, opponent.boxer)" class="btn btn-success btn-sm">
                                <i class="bi bi-person-plus-fill"></i>
                            </button>
                            <button v-if="store.isCompeting(boxer, opponent.boxer)"
                                @click="store.removeFromFightCard(boxer, opponent.boxer)" class="btn btn-danger btn-sm">
                                <i class="bi bi-person-dash-fill"></i>
                            </button>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from '@/types/boxing.d'
import { ModalityError, ModalityErrorType } from '@/types/modality.d'
import ModalityErrorComponent from "@/components/core/modality-error.component.vue"

import { store } from '@/composables/fight.composable';

export default defineComponent({
    components: {
        ModalityErrorComponent: ModalityErrorComponent
    },
    data() {
        let ret = {
            store,
            Gender: Gender,
            ModalityErrorType: ModalityErrorType,
        };

        // this.fightCard = JSON.parse(localStorage.getItem('fightCard') || "{}");

        return ret;
    },
    mounted() {
        // if (localStorage.boxers) {
        //   this.boxers = JSON.parse(localStorage.boxers) || [];
        //   this.boxers = this.boxers.map(b => b.opponents)
        // }
        // if (localStorage.fightCard) {
        //   this.fightCard = JSON.parse(localStorage.fightCard) || [];
        // }
        if (localStorage.boxing) {
            const boxingStorage: BoxingStorage = JSON.parse(localStorage.boxing) || {};
            this.store.boxers = boxingStorage.boxers.map<Boxer>((b) => {
                return { attributes: b, collapsed: true, opponents: [] } as Boxer;
            });
            this.store.computeBoxerOpponents();
        }
    },
    watch: {
        boxers(newBoxers: Boxer[]) {
            // let toStore = newBoxers.map<Boxer>((b) => {
            //   let b1 = {...b};
            //   b1.opponents = [];
            //   return b1
            // });
        },
        // fightCard: {
        //   handler(newFightCard) {
        //     (localStorage.boxingStorage as BoxingStorage).fights
        //   }, deep: true
        // }
    },
    methods: {

        toggleCollapse(index: number): void {
            this.store.boxers[index].collapsed = !this.store.boxers[index].collapsed;
        },
        expandAll() {
            let collapse = true;
            if (this.store.boxers[0]?.collapsed) {
                collapse = false;
            }
            for (let [index, boxer] of this.store.boxers.entries()) {
                this.store.boxers[index].collapsed = collapse;
            }
        }
    },
});
</script>
  
<style>
/* Add your component-specific styles here */
</style>
