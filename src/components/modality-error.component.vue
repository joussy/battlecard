<template>
    <span v-if="modalityError.type == ModalityErrorType.WEIGHT">
        <img src="@/assets/icons/scale.svg" />
    </span>
    <span v-if="modalityError.type == ModalityErrorType.AGE" class="badge bg-danger">Age</span>
    <span v-if="modalityError.type == ModalityErrorType.PRIZE_LIST">
        <img src="@/assets/icons/medal.svg" />
    </span>
</template>

<script lang="ts">
import { ModalityError, ModalityErrorType } from '../types/modality.d'

export default {
    props: ['modalityError'],
    data() {
        return {
            ModalityErrorType: ModalityErrorType,
        }
    }
}
</script>
