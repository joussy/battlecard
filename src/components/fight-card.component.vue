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
            <tr
                v-for="(fight, index) in store.fightCard"
                :key="index"
            >
                <th scope="row">
                    {{ index + 1 }}
                </th>
                <td>{{ store.getBoxerDisplayName(fight.boxer1) }}</td>
                <td>{{ store.getBoxerDisplayName(fight.boxer2) }}</td>
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
                        class="btn btn-outline-danger btn-sm ms-2"
                        @click="store.removeFromFightCardByIndex(index)"
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
import { fightCardStore } from "@/composables/fight.composable"
import Icon from "@/components/core/icon.component.vue"

export default {
    components: {
        ModalityErrorComponent: ModalityErrorComponent,
        Icon: Icon,
    },
    data() {
        return {
            Gender: Gender,
            store: fightCardStore,
        }
    },
    methods: {},
}
</script>
