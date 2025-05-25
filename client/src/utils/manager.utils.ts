import { useUiStore } from "@/stores/ui.store"

function getAuthHeaders(): Record<string, string> {
    const token = useUiStore().jwtToken
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

export async function getRaw(
    url: string,
    params?: Record<string, unknown>,
    errorMsg = "Request failed"
): Promise<Response> {
    let fullUrl = url
    if (params && Object.keys(params).length > 0) {
        fullUrl += `?${buildQuery(params)}`
    }
    const res = await fetch(fullUrl, { headers: getAuthHeaders() })
    if (!res.ok) throw new Error(errorMsg)
    return await res
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

export async function mutateRaw(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown,
    errorMsg = "Request failed"
): Promise<Response> {
    const res = await fetch(url, {
        method,
        headers: mergeHeaders({ "Content-Type": "application/json" }),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(errorMsg)
    return await res
}

export async function postAndDownload(url: string, payload: object | [], filename: string): Promise<void> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: mergeHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Get the response as a Blob
        const blob = await response.blob()

        // Create a temporary link element to trigger the download
        const link = document.createElement("a")
        const urlBlob = URL.createObjectURL(blob)
        link.href = urlBlob
        link.download = filename
        document.body.appendChild(link) // Attach link to the DOM
        link.click() // Trigger download
        document.body.removeChild(link) // Clean up the link
        URL.revokeObjectURL(urlBlob) // Release memory
    } catch (error) {
        console.error("Error downloading PDF:", error)
        throw error // Rethrow for further handling
    }
}
