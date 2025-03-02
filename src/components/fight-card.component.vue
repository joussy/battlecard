<template>
    <table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Red</th>
                <th scope="col">Blue</th>
                <th scope="col" />
                <th scope="col" />
                <th scope="col" />
            </tr>
        </thead>
        <tbody>
            <tr v-for="fight in store.fightCard">
                <th scope="row">
                    {{ fight.order + 1 }}
                </th>
                <td>{{ fightService.getBoxerDisplayName(fight.boxer1.attributes) }}</td>
                <td>{{ fightService.getBoxerDisplayName(fight.boxer2.attributes) }}</td>
                <td>
                    <Icon
                        v-if="fight.boxer1.attributes.gender == Gender.MALE"
                        name="male"
                    />
                    <Icon
                        v-if="fight.boxer1.attributes.gender == Gender.FEMALE"
                        name="female"
                    />
                </td>
                <td>
                    <span v-for="modalityError in fight.modalityErrors">
                        <ModalityErrorComponent :modality-error="modalityError" />
                    </span>
                </td>
                <td>
                    <button
                        class="btn ms-0"
                        @click="fightService.switchFight(fight.id)"
                    >
                        <i class="bi bi-arrow-left-right" />
                    </button>
                    <button
                        class="btn ms-0"
                        @click="fightService.moveFight(fight.id, fight.order - 1)"
                    >
                        <i class="bi bi-arrow-up" />
                    </button>
                    <button
                        class="btn ms-0"
                        @click="fightService.moveFight(fight.id, fight.order + 1)"
                    >
                        <i class="bi bi-arrow-down" />
                    </button>
                    <button
                        class="btn btn-outline-danger btn-sm ms-2"
                        @click="fightService.removeFromFightCard(fight.boxer1, fight.boxer2)"
                    >
                        <i class="bi bi-person-dash-fill" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { Gender } from "@/types/boxing.d"
import ModalityErrorComponent from "@/components/core/modality-error.component.vue"
import Icon from "@/components/core/icon.component.vue"
import fightService from "@/services/fight.service"

export default {
    components: {
        ModalityErrorComponent: ModalityErrorComponent,
        Icon: Icon,
    },
    data() {
        return {
            Gender: Gender,
            store: fightService.store(),
            fightService: fightService,
        }
    },
    methods: {},
}
</script>
