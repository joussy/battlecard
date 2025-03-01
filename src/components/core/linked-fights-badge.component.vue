<template>
    <span
        class="badge ms-1"
        :class="{
            'text-bg-success': fightService.getNbFightsForBoxer(boxer) < 2,
            'text-bg-warning': fightService.getNbFightsForBoxer(boxer) == 2,
            'text-bg-danger': fightService.getNbFightsForBoxer(boxer) > 2,
            invisible: fightService.getNbFightsForBoxer(boxer) < 1,
        }"
    >
        <Icon name="link" />
        {{ fightService.getNbFightsForBoxer(boxer) }}
    </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"

import { fightCardStore } from "@/composables/fight.composable"
import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/types/modality"
import IconComponent from "@/components/core/icon.component.vue"
import fightService from "@/services/fight.service"

export default defineComponent({
    components: {
        Icon: IconComponent,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
        modalityError: {
            type: Object as PropType<ModalityError>,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            store: fightCardStore,
            fightService: fightService,
        }
    },
})
</script>
