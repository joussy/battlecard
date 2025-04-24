import { reactive, readonly } from "vue"
import PocketBase from "pocketbase"
import { UserAccount } from "@/types/user"

const pocketBase = import.meta.env.VITE_SERVER_URL ? new PocketBase(import.meta.env.VITE_SERVER_URL) : null
const userStore = reactive({
    restored: false as boolean,
    account: null as null | UserAccount,
    tournamentId: null as string | null,
    authenticationAvailable: pocketBase != null,
    async authenticate() {
        if (!pocketBase || pocketBase.authStore.isValid) return null
        if (import.meta.env.VITE_LOCAL_USER) {
            pocketBase
                .collection("users")
                .authWithPassword(import.meta.env.VITE_LOCAL_USER, import.meta.env.VITE_LOCAL_PASSWORD)
        } else {
            await pocketBase.collection("users").authWithOAuth2({ provider: "google" })
        }
        updateAccount()
    },
    getAccountOrThrow(): UserAccount {
        if (!userStore.account) throw "Cannot before action because the user is disconnected"

        return this.account!
    },
    logout() {
        if (!pocketBase) return null
        pocketBase.authStore.clear()
    },
})

function updateAccount() {
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

        userStore.account.apiEnabled = true
    }
}

function loadUserStore() {
    console.debug("loading user ... ")
    pocketBase?.authStore.onChange(() => {
        updateAccount()
    })
    updateAccount()
    userStore.restored = true
}

const readOnlyUserStore = readonly(userStore)

export { loadUserStore, readOnlyUserStore as userStore }
