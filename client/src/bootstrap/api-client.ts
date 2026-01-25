import { Router } from "vue-router"
import { client as clientOpenApi } from "../api/client.gen"
import { useUiStore } from "../stores/ui.store"

/**
 * Sets up the OpenAPI client with base URL and interceptors for locale and session handling.
 * @param router - The Vue Router instance for navigation on session expiration.
 */
export function setupApiClient(router: Router) {
    clientOpenApi.setConfig({ baseUrl: "/" })
    clientOpenApi.interceptors.request.use((request) => {
        const locale = useUiStore().language
        if (locale) {
            request.headers.append("Accept-Language", locale)
        }
        return request
    })
    clientOpenApi.interceptors.response.use((response) => {
        const sessionExpired = response.headers.get("X-Session-Expired")
        const routeRequiresAuth = router.currentRoute.value.meta.requiresAuth
        if (sessionExpired == "true" && routeRequiresAuth === true) {
            router.push({ name: "auth" })
        }
        return response
    })
    clientOpenApi.interceptors.response.use((response) => {
        if (response.status >= 400) {
            throw response
        }
        return response
    })
}
