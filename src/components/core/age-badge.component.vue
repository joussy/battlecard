<template>
    <span
        class="badge ms-2"
        :class="{
            'text-bg-danger': modalityError,
            'text-bg-light': !modalityError,
        }"
    >
        <Icon
            name="birthday-cake"
        />
        {{ getBoxerAge() }}
    </span>
</template>

<script lang="ts">
import { Boxer } from "@/types/boxing"
import { ModalityError } from "@/types/modality"
import { PropType, defineComponent } from "vue"
import { differenceInYears } from "date-fns"
import Icon from "@/components/core/icon.component.vue"

export default defineComponent({
    components:{
        Icon: Icon
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
    methods: {
        getBoxerAge(): number {
            return differenceInYears(new Date(), this.boxer.attributes.birthDate)
        },
    },
})
</script>
