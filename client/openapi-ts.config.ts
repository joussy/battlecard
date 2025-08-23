import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
    input: "../server/openapi.json",
    output: "src/api",
    plugins: [
        // ...other plugins
        {
            asClass: false, // default
            name: "@hey-api/sdk",
        },
    ],
})
