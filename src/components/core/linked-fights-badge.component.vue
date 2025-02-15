<template>
    <span
        class="badge ms-2"
        :class="{
            'text-bg-success': store.getNbFightsForBoxer(boxer) < 2,
            'text-bg-warning': store.getNbFightsForBoxer(boxer) == 2,
            'text-bg-danger': store.getNbFightsForBoxer(boxer) > 2,
            invisible: store.getNbFightsForBoxer(boxer) < 1,
        }"
    >
    <Icon name="link" />
    {{ store.getNbFightsForBoxer(boxer) }}
    </span>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue"

import { store } from "@/composables/fight.composable"
import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/types/modality"
import IconComponent from "@/components/core/icon.component.vue"

export default defineComponent({
    components:{
        Icon: IconComponent
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
            store,
        }
    },
})
</script>
