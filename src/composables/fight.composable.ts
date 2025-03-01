import { reactive, toRaw, watchEffect } from "vue"
import { Boxer, Fight } from "@/types/boxing.d"
import { FightCardStorage, BoxerStorage, FightStorage } from "@/types/localstorage.d"
import { BeaModality } from "@/fightModality/BeaModality"

export const fightCardStore = reactive({
    restored: false as boolean,
    fightCard: [] as Fight[],
    boxers: [] as Boxer[],
    modality: new BeaModality(),
})

watchEffect(() => {
    if (!fightCardStore.restored) {
        return
    }

    const localStorageData: FightCardStorage = {
        boxers: fightCardStore.boxers.map((b): BoxerStorage => {
            return { attributes: toRaw(b.attributes), collapsed: b.collapsed }
        }),
        fightCard: fightCardStore.fightCard.map((f) => {
            return { boxer1Id: f.boxer1.attributes.id, boxer2Id: f.boxer2.attributes.id } as FightStorage
        }),
    }
    localStorage.setItem("fightCardStore", JSON.stringify(localStorageData))
    console.debug("store updated")
})
