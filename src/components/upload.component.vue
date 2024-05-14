<template>
    <div class="card">
        <div class="card-header"><i class="bi bi-gear-fill mr-1"></i>Options</div>
        <div class="card-body">
            <h5 class="card-title">
                <i class="bi bi-clipboard mr-2"></i>Import from clipboard
            </h5>
            <p class="card-text">
            <p>Nom | Prénom | Combats | Sexe | Poids | Club</p>
            <textarea class="d-block w-50 mb-2" v-model="clipboard" />
            <button class="btn btn-primary" @click="processClipboard()">Import</button>
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Boxer, Gender, Fight, BoxingData, Opponent, BoxingStorage, BoxerAttributes, ClubFighters } from '@/types/boxing.d'
import { store } from '@/composables/fight.composable';
import { ModalityError, ModalityErrorType } from '@/types/modality.d'

export default defineComponent({
    data() {
        return {
        store,
        Gender: Gender,
        // Nom	Prénom	Combats		Sexe	Poids	Club
        clipboard: `
JOSHUA	Anthony	1	H	50	Club1
FURY	Tyson	2	H	51	Club2
TYSON	Mike	3	H	52	Club3
STARR	Joey	4	H	53	Club4
MONTANA	Tony	5	H	90	Club5
NICOLSON	Skye	6	F	55	Club6
TAYLOR	Katie	7	F	56	Club7
SERRANO	Amanda	8	F	57	Club1
      `.trim()
    };
},
    methods: {
    processClipboard() {
        let ret: any = this.tsvToJson(this.clipboard, [
            'lastName',
            'firstName',
            'nbFights',
            'gender',
            'weight',
            'club'
        ])
        this.store.clear();
        for (const [index, entry] of ret.entries()) {
            this.store.boxers.push({
                collapsed: true,
                opponents: [],
                attributes: {
                    id: index,
                    lastName: entry.lastName,
                    firstName: entry.firstName,
                    birthDate: new Date(entry.birthDate),
                    nbFights: parseInt(entry.nbFights),
                    category: "",
                    club: entry.club,
                    weight: parseInt(entry.weight),
                    gender: entry.gender == 'F' ? Gender.FEMALE : Gender.MALE
                }
            });
        }
        this.store.computeBoxerOpponents();
    },
    tsvToJson(tsvText: string, headers: string[]): object {
      //Split all the text into seperate lines on new lines and carriage return feeds
      var allTextLines = tsvText.split(/\r\n|\n/);
      //Split per line on tabs and commas
      // var headers = allTextLines[0].split(/\t|,/);
      var lines = [];

      for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(/\t|,|;/);

        var row: any = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j]] = data[j];
        }
        lines.push(row);
      }

      return lines;
    }
}
});
</script>