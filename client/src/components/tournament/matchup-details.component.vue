<template>
    <div class="border container">
        <div class="row">
            <div
                v-for="(boxer, index) in [fight.boxer1, fight.boxer2]"
                :key="boxer.id"
                class="col-md-6"
                :class="`matchup-boxer-${index + 1}`"
            >
                <div class="pt-1 pb-1">
                    <div class="name">{{ boxer.firstName }} {{ boxer.lastName }}</div>
                    <div class="club"><i class="bi bi-house-fill me-1"></i>{{ boxer.club }}</div>
                    <div class="age">
                        <IconComponent :name="boxer.gender == Gender.MALE ? 'male' : 'female'"> </IconComponent>
                        {{ getBirthDateAndAge(boxer) }}
                    </div>
                    <IconComponent
                        name="scale"
                        class="me-1"
                    ></IconComponent
                    >{{ boxer.weight }} kg
                    <IconComponent
                        name="medal"
                        class="me-1"
                    ></IconComponent
                    >{{ boxer.nbFights }} fights
                    <div>
                        <i class="bi bi-person-vcard"></i> {{ boxer.license }} -
                        {{ boxer.category }}
                    </div>
                </div>
            </div>
        </div>
        <div class="row pt-1 pb-1">
            <div>
                <i class="bi bi-stopwatch me-1"></i>
                Fight Duration: {{ getFightDuration(fight) }}
            </div>
            <div>Weight difference: {{ getWeightDifference(fight) }}</div>
            <div>Age difference: {{ getAgeDifference(fight) }}</div>
            <div>Fight count difference: {{ getNbFightsDifference(fight) }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { Boxer, Fight } from "@/types/boxing"
import { defineComponent, PropType } from "vue"
import { getAgeDifference, getBirthDateAndAge, getFightDurationAsString } from "@/utils/string.utils"
import { Gender } from "@/shared/types/modality.type"
import IconComponent from "../core/icon.component.vue"

export default defineComponent({
    components: {
        IconComponent: IconComponent,
    },
    props: {
        fight: {
            type: Object as PropType<Fight>,
            required: true,
        },
    },
    data() {
        return { Gender }
    },
    methods: {
        getBirthDateAndAge(boxer: Boxer) {
            return getBirthDateAndAge(boxer.birthDate)
        },
        getFightDuration(fight: Fight): string {
            return getFightDurationAsString(fight.rounds, fight.roundDurationSeconds)
        },
        getWeightDifference(fight: Fight): string {
            const weight1 = fight.boxer1.weight
            const weight2 = fight.boxer2.weight
            return `${Math.abs(weight1 - weight2)} kg`
        },
        getAgeDifference(fight: Fight): string {
            // return ""
            return getAgeDifference(fight.boxer1.birthDate, fight.boxer2.birthDate)
        },
        getNbFightsDifference(fight: Fight): string {
            const nbFights1 = fight.boxer1.nbFights
            const nbFights2 = fight.boxer2.nbFights
            return `${Math.abs(nbFights1 - nbFights2)} fights`
        },
    },
})
</script>
<style lang="scss">
.matchup-boxer-1 {
    background-color: #d9241038;
}
.matchup-boxer-2 {
    background-color: #127dda38;
}

.eligibility-details {
    & > div {
        flex: 0 0 50%; /* each item takes 50% width. So 2 items max per line*/
        padding: 10px;
        margin: 0;
        border: 1px solid var(--bs-border-color);
        min-width: 200px;
    }
}
</style>
