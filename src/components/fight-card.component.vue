<template>
    <div class="d-flex">
        <h3 class="flex-grow-1"></h3>
        <button
            v-if="userStore.account"
            class="btn btn-outline-secondary mb-3 ms-2"
            @click="downloadPdf"
        >
            <i class="bi bi-file-earmark-pdf-fill" />
        </button>
    </div>
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
        <draggable
            v-model="fightCard as unknown[] | undefined"
            tag="tbody"
            item-key="id"
            handle=".handle"
            @end="moved"
        >
            <template #item="{ element: fight }">
                <tr>
                    <th scope="row">
                        <span class="pe-2">
                            {{ fight.order }}
                        </span>
                        <button class="btn ms-0 handle p-0">
                            <i class="bi bi-grip-horizontal" />
                        </button>
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
                            class="btn btn-outline-danger btn-sm ms-2"
                            @click="fightService.removeFromFightCard(fight.boxer1, fight.boxer2)"
                        >
                            <i class="bi bi-person-dash-fill" />
                        </button>
                    </td>
                </tr>
            </template>
        </draggable>
    </table>
</template>

<script lang="ts">
import { Gender } from "@/types/boxing.d"
import ModalityErrorComponent from "@/components/core/modality-error.component.vue"
import Icon from "@/components/core/icon.component.vue"
import fightService from "@/services/fight.service"
import { ApiService } from "@/services/api.service"
import { userStore } from "@/composables/user.composable"
import draggable from "vuedraggable"

export default {
    components: {
        ModalityErrorComponent: ModalityErrorComponent,
        Icon: Icon,
        draggable,
    },
    data() {
        return {
            Gender: Gender,
            fightStore: fightService.store(),
            fightService: fightService,
            userStore: userStore,
        }
    },
    computed: {
        fightCard: {
            get() {
                return fightService.store().fightCard
            },
            set() {
                /* Avoid error on readonly collection */
            },
        },
    },
    methods: {
        async downloadPdf() {
            await ApiService.downloadFightCardAsPdf()
        },
        moved(evt: { oldIndex?: number; newIndex?: number }) {
            if (evt?.oldIndex !== undefined && evt?.newIndex !== undefined) {
                fightService.moveFight(this.fightCard[evt.oldIndex].id, evt.newIndex)
            }
        },
    },
}
</script>
