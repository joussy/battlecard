/* eslint-env node */
import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgLoader(), vue()],
    server: {
        host: "0.0.0.0",
        watch: {
            usePolling: true,
        },
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // or "modern"
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
            },
        },
    },
})
