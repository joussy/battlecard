import { uiStore } from "@/composables/ui.composable"

function getAuthHeaders(): Record<string, string> {
    const token = uiStore.account?.authToken || localStorage.getItem("jwtToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function mergeHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return { ...getAuthHeaders(), ...extra }
}

function buildQuery(params: Record<string, unknown>): string {
    const esc = encodeURIComponent
    return Object.keys(params)
        .filter((k) => params[k] !== undefined && params[k] !== null)
        .map((k) => `${esc(k)}=${esc(params[k] as string)}`)
        .join("&")
}

export async function get<T>(url: string, params?: Record<string, unknown>, errorMsg = "Request failed"): Promise<T> {
    let fullUrl = url
    if (params && Object.keys(params).length > 0) {
        fullUrl += `?${buildQuery(params)}`
    }
    const res = await fetch(fullUrl, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(errorMsg)
    if (res.status === 204) return undefined as unknown as T
    return await res.json()
}

export async function mutate<T>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown,
    errorMsg = "Request failed"
): Promise<T> {
    const res = await fetch(url, {
        method,
        headers: mergeHeaders({ "Content-Type": "application/json" }),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(errorMsg)
    if (res.status === 204) return undefined as unknown as T
    return await res.json()
}
