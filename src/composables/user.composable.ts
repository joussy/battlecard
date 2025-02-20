import { reactive, watchEffect } from "vue"
import { UserStorage } from "@/types/localstorage.d"
import PocketBase from "pocketbase"
import { UserAccount } from "@/types/user"

const pocketBase = import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null

export const userStore = reactive({
    darkMode: false,
    hideNonMatchableOpponents: false,
    hideFightersWithNoMatch: false,
    restored: false as boolean,
    account: null as UserAccount | null,
    authenticationAvailable: pocketBase != null,
    async authenticate() {
        if (!pocketBase || pocketBase.authStore.isValid) return null
        await pocketBase.collection("users").authWithOAuth2({ provider: "google" })
        await updateAccount()
    },
    async logout() {
        if (!pocketBase) return null
        await pocketBase.authStore.clear()
    },
})

async function updateAccount() {
    if (!pocketBase?.authStore.isValid) {
        userStore.account = null
    } else if (pocketBase?.authStore.record) {
        userStore.account = {
            id: pocketBase.authStore.record.id,
            name: pocketBase.authStore.record.name as string,
            email: pocketBase.authStore.record.email as string,
            avatar: null,
            apiEnabled: false,
            authToken: pocketBase.authStore.token,
        }
        if (pocketBase.authStore.record?.avatar) {
            userStore.account.avatar = pocketBase.files.getURL(
                pocketBase.authStore.record,
                pocketBase.authStore.record.avatar,
                {}
            )
        }
        const record = await pocketBase.collection("users").getOne(pocketBase.authStore.record.id, {
            // expand: "relField1,relField2.subRelField",
        })
        userStore.account.apiEnabled = record.apiEnabled
        console.log(record)
    }
}

export async function loadUserStore() {
    console.debug("loading user ... ")
    pocketBase?.authStore.onChange(async () => {
        await updateAccount()
    })
    await updateAccount()
    const localStorageDataString = localStorage.getItem("userStore")
    if (localStorageDataString) {
        const localStorageData: UserStorage = JSON.parse(localStorageDataString)

        userStore.darkMode = localStorageData.darkMode
        userStore.hideNonMatchableOpponents = localStorageData.hideNonMatchableOpponents
        userStore.hideFightersWithNoMatch = localStorageData.hideFightersWithNoMatch

        console.debug("store loaded")
    } else {
        console.debug("no store available ... ")
    }
    userStore.restored = true
}

watchEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute("data-bs-theme", userStore.darkMode ? "dark" : "light")
})

watchEffect(() => {
    if (!userStore.restored) {
        return
    }

    const localStorageData: UserStorage = {
        darkMode: userStore.darkMode,
        hideNonMatchableOpponents: userStore.hideNonMatchableOpponents,
        hideFightersWithNoMatch: userStore.hideFightersWithNoMatch,
    }
    localStorage.setItem("userStore", JSON.stringify(localStorageData))
    console.debug("user store updated")
})
