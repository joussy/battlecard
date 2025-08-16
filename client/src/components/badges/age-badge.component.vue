<template>
    <span
        class="badge"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon name="birthday-cake" />
        <span class="number-text">{{ getBoxerAge() }}</span>
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError, ModalityErrorType } from "@/shared/types/modality.type"
import { PropType, defineComponent } from "vue"
import Icon from "@/components/core/icon.component.vue"
import { getBoxerAge } from "@/utils/string.utils"

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
            return getBoxerAge(this.boxer.birthDate)
        },
    },
})
</script>
