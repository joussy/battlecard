import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
    input: "../server/openapi.json",
    output: "src/api",
    plugins: [
        // ...other plugins
        {
            asClass: true, // default
            name: "@hey-api/sdk",
            classNameBuilder: (tag) => {
                return (
                    tag
                        .split(/[\s-_]+/)
                        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join("") + "OpenApi"
                )
            },
            methodNameBuilder: (operation) => {
                return (operation.id ?? "ERROR")
                    .replace(/^.*Controller/, "")
                    .replace(/^[A-Z]/, (match) => match.toLowerCase())
            },
            responseStyle: "data",
        },
    ],
})
