import { uiStore } from "@/composables/ui.composable"

export function getAuthHeaders(): Record<string, string> {
    const token = uiStore.account?.authToken || localStorage.getItem("jwtToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function mergeHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return { ...getAuthHeaders(), ...extra }
}

export function buildQuery(params: Record<string, unknown>): string {
    const esc = encodeURIComponent
    return Object.keys(params)
        .filter((k) => params[k] !== undefined && params[k] !== null)
        .map((k) => `${esc(k)}=${esc(params[k] as string)}`)
        .join("&")
}
