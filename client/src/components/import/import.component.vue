<template>
    <ImportTableComponent :input-boxers="rows" />
</template>
<script lang="ts">
import ImportTableComponent from "@/components/import/import-table.component.vue"
import { ApiImportBoxer } from "@/shared/types/api"
import { Gender } from "@/shared/types/modality.type"
export default {
    name: "ImportComponent",
    components: {
        ImportTableComponent: ImportTableComponent,
    },
    data() {
        return {
            rows: [
                {
                    name: "Smith",
                    firstname: "John",
                    fights: 5,
                    gender: Gender.MALE,
                    weight: 75,
                    club: "Red Dragons",
                    birth_date: "2000-01-01",
                    license: "A12345",
                },
                {
                    name: "Doe",
                    firstname: "Jane",
                    gender: Gender.FEMALE,
                    weight: 60,
                    club: "Blue Tigers",
                    birth_date: "2002-05-15",
                    license: "B67890",
                },
                {
                    name: "Brown",
                    firstname: "Charlie",
                    fights: 2,
                    gender: Gender.MALE,
                    weight: 60,
                    club: "Green Bears",
                    birth_date: "2001-09-10",
                    license: "A12345", // duplicate license
                },
                {
                    name: "White",
                    firstname: "Emily",
                    fights: 4,
                    gender: Gender.FEMALE,
                    weight: 60,
                    club: "Yellow Foxes",
                    birth_date: "2003-12-22",
                    license: "C54321",
                },
            ] as ApiImportBoxer[],
        }
    },
}
</script>
