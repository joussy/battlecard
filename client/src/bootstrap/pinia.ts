import { createPinia } from "pinia"
import { Router } from "vue-router"

/**
 * Creates a Pinia store instance and injects the router for use in stores.
 * @param router - The Vue Router instance to inject into Pinia.
 */
export function createPiniaWithRouter(router: Router) {
    const pinia = createPinia()
    pinia.use(() => ({ router }))
    return pinia
}
