<template>
    <div class="border container">
        <div class="row">
            <div
                v-for="(boxer, index) in [props.fight.boxer1, props.fight.boxer2]"
                :key="boxer.id"
                class="col-sm-6"
                :class="`matchup-boxer-${index + 1}`"
            >
                <div class="pt-1 pb-1">
                    <div class="name">{{ boxer.firstName }} {{ boxer.lastName }}</div>
                    <div class="club"><i class="bi bi-house-fill me-1"></i>{{ boxer.club }}</div>
                    <div class="age">
                        <IconComponent :name="boxer.gender == Gender.MALE ? 'male' : 'female'"> </IconComponent>
                        {{ getBirthDateAndAge(boxer) }}
                    </div>
                    <div>
                        <IconComponent
                            name="scale"
                            class="me-1"
                        ></IconComponent>
                        {{ boxer.weight }} {{ $t("common.kg") }}
                    </div>
                    <div>
                        <IconComponent
                            name="medal"
                            class="me-1"
                        ></IconComponent
                        >{{ boxer.nbFights }} {{ $t("matchupDetails.fights") }}
                    </div>
                    <div>
                        <i class="bi bi-person-vcard"></i> {{ boxer.license }} -
                        {{ boxer.category }}
                    </div>
                </div>
            </div>
            <div class="row pt-1 pb-1">
                <div>
                    <i class="bi bi-stopwatch me-1"></i>
                    {{ $t("matchupDetails.fightDuration") }}: {{ getFightDuration(props.fight) }}
                </div>
                <div>{{ $t("matchupDetails.weightDifference") }}: {{ getWeightDifference(props.fight) }}</div>
                <div>{{ $t("matchupDetails.ageDifference") }}: {{ getAgeDifferenceLocal(props.fight) }}</div>
                <div>{{ $t("matchupDetails.fightCountDifference") }}: {{ getNbFightsDifference(props.fight) }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { Boxer, Fight } from "@/types/boxing"
import {
    getAgeDifference,
    getBirthDateAndAge as utilGetBirthDateAndAge,
    getFightDurationAsString,
} from "@/utils/string.utils"
import { Gender } from "@/api"
import IconComponent from "@/components/shared/core/icon.component.vue"

const { t: $t } = useI18n()

interface Props {
    fight: Fight
}

const props = defineProps<Props>()

const getBirthDateAndAge = (boxer: Boxer) => {
    return utilGetBirthDateAndAge(boxer.birthDate)
}

const getFightDuration = (fight: Fight): string => {
    return getFightDurationAsString(fight.rounds, fight.roundDurationSeconds)
}

const getWeightDifference = (fight: Fight): string => {
    const weight1 = fight.boxer1.weight
    const weight2 = fight.boxer2.weight
    return `${Math.abs(weight1 - weight2)} kg`
}

const getAgeDifferenceLocal = (fight: Fight): string => {
    return getAgeDifference(fight.boxer1.birthDate, fight.boxer2.birthDate)
}

const getNbFightsDifference = (fight: Fight): string => {
    const nbFights1 = fight.boxer1.nbFights
    const nbFights2 = fight.boxer2.nbFights
    return `${Math.abs(nbFights1 - nbFights2)} ${$t("matchupDetails.fights")}`
}
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
