import { reactive, readonly } from "vue"
import { UserAccount } from "@/types/user"

let jwtToken: string | null = localStorage.getItem("jwtToken")

const userStore = reactive({
    restored: false as boolean,
    account: null as null | UserAccount,
    tournamentId: null as string | null,
    authenticate() {
        // Open popup for Google OAuth
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2
        window.open(
            "/api/auth/google",
            "GoogleAuth",
            `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
        )
    },
    async setTokenAndFetchUser(token: string) {
        jwtToken = token
        localStorage.setItem("jwtToken", token)
        // Fetch user profile from backend
        const res = await fetch("/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
            const user = await res.json()
            this.account = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || null,
                apiEnabled: true,
                authToken: token,
            }
        } else {
            this.account = null
        }
    },
    getAccountOrThrow(): UserAccount {
        if (!userStore.account) throw "Cannot before action because the user is disconnected"

        return this.account!
    },
    logout() {
        jwtToken = null
        localStorage.removeItem("jwtToken")
        this.account = null
    },
})

function updateAccount() {}

function loadUserStore() {
    console.debug("loading user ... ")
    const token = localStorage.getItem("jwtToken")
    if (token) {
        userStore.setTokenAndFetchUser(token)
    }
    updateAccount()
    userStore.restored = true
}

const readOnlyUserStore = readonly(userStore)

export { loadUserStore, readOnlyUserStore as userStore }
