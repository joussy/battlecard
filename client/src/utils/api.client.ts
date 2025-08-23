import { createClient, createConfig } from '@/api/client'
import type { ClientOptions } from '@/api/client/types.gen'
import { useUiStore } from '@/stores/ui.store'

/**
 * Creates an authenticated API client using the generated OpenAPI SDK
 */
export function createApiClient() {
    const uiStore = useUiStore()
    
    const config = createConfig<ClientOptions>({
        headers: uiStore.jwtToken ? {
            Authorization: `Bearer ${uiStore.jwtToken}`
        } : {}
    })
    
    return createClient(config)
}

// Create default client instance
export const apiClient = createApiClient()