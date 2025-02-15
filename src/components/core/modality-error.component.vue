<template>
    <span v-if="modalityError.type == ModalityErrorType.WEIGHT">
        <Icon name="scale" />
    </span>
    <!-- <span v-if="modalityError.type == ModalityErrorType.AGE" class="badge bg-danger">Age</span> -->
    <span v-if="modalityError.type == ModalityErrorType.AGE">
        <Icon name="birthday-cake" />
    </span>
    <span v-if="modalityError.type == ModalityErrorType.PRIZE_LIST">
        <Icon name="medal" />
    </span>
</template>

<script lang="ts">
import { ModalityError, ModalityErrorType } from "@/types/modality.d"
import { PropType } from "vue"
import Icon from "@/components/core/icon.component.vue"

export default {
    components:{
        Icon: Icon,
    },
    props: {
        modalityError: {
            type: Object as PropType<ModalityError>,
            required: true,
        },
    },
    data() {
        return {
            ModalityErrorType: ModalityErrorType,
        }
    },
}
</script>
