<template>
    <span
        class="badge ms-1"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="birthday-cake" />
        {{ getBoxerAge() }}
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError, ModalityErrorType } from "@/shared/types/modality.type"
import { PropType, defineComponent } from "vue"
import { differenceInYears } from "date-fns"
import Icon from "@/components/core/icon.component.vue"

export default defineComponent({
    components: {
        Icon: Icon,
    },
    props: {
        boxer: {
            type: Object as PropType<Boxer>,
            required: true,
        },
        modalityErrors: {
            type: Object as PropType<ModalityError[] | null>,
            required: false,
            default: null,
        },
    },
    computed: {
        modalityError() {
            return this.modalityErrors?.some((error) => error.type == ModalityErrorType.AGE)
        },
    },
    methods: {
        getBoxerAge(): number {
            return differenceInYears(new Date(), this.boxer.birthDate)
        },
    },
})
</script>
