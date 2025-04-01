<template>
    <div class="max-width-md">
        Choose an event
        <div
            v-for="tournament in fightStore.tournaments"
            class="card mb-2"
        >
            <div class="card-body">{{ tournament.name }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import fightService from "@/services/fight.service"
import { defineComponent } from "vue"

export default defineComponent({
    data() {
        return {
            fightStore: fightService.store(),
        }
    },
    mounted() {},
    methods: {},
})
</script>
<style lang="scss"></style>
