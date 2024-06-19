<template>
    <div class="card">
        <div class="card-header"><i class="bi bi-gear-fill me-1" />Options</div>
        <div class="card-body">
            <h5 class="card-title"><i class="bi bi-clipboard me-2" />Import from clipboard</h5>
            <p class="card-text">
                <span>Nom | Prénom | Combats | Sexe | Poids | Club</span>
                <textarea
                    v-model="clipboard"
                    class="d-block w-100 mb-2"
                />
                <button
                    class="btn btn-primary"
                    @click="processClipboard()"
                >
                    Import
                </button>
                <button
                    class="btn btn-danger ms-2"
                    @click="clearStore()"
                >
                    Clear Local Storage
                </button>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { Gender } from "@/types/boxing.d"
import { store } from "@/composables/fight.composable"
import { tsvToJson } from "@/utils/csvUtils"
import { parse } from "date-fns"

export default defineComponent({
    data() {
        return {
            store,
            Gender: Gender,
            // LastName	FirstName	Fights		Sex	Weight	Club	Birthdate   License
            clipboard: `
JOSHUA	Anthony	1	H	50	Club1	1/1/2010	A0001
FURY	Tyson	2	H	51	Club2	2/1/2010	B0002
TYSON	Mike	3	H	52	Club3	3/2/2011	C0003
STARR	Joey	4	H	53	Club4	4/2/2011	D0004
MONTANA	Tony	5	H	90	Club5	5/3/2012	E0005
NICOLSON	Skye	6	F	55	Club6	6/3/2012	F0006
TAYLOR	Katie	7	F	56	Club7	7/4/2013	G0007
SERRANO	Amanda	8	F	57	Club1	8/4/2014	A0008
      `.trim(),
        }
    },
    methods: {
        processClipboard() {
            const ret = tsvToJson(this.clipboard, ["lastName", "firstName", "nbFights", "gender", "weight", "club", "birthDate", "license"])
            this.store.clear()
            for (const [index, entry] of ret.entries()) {
                // console.log(parse(entry.birthDate, 'dd/MM/yyyy', new Date()))
                this.store.boxers.push({
                    collapsed: true,
                    opponents: [],
                    attributes: {
                        id: index,
                        lastName: entry.lastName,
                        firstName: entry.firstName,
                        birthDate: parse(entry.birthDate, "dd/MM/yyyy", new Date()),
                        nbFights: parseInt(entry.nbFights),
                        category: "",
                        categoryShortText: "",
                        club: entry.club,
                        weight: parseInt(entry.weight),
                        gender: entry.gender == "F" ? Gender.FEMALE : Gender.MALE,
                        license: entry.license,
                    },
                })
            }
            this.store.computeBoxerOpponents()
        },
        clearStore() {
            localStorage.removeItem("store")
        },
    },
})
</script>
