/* eslint-env node */
import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgLoader(), vue()],
    server: {
        watch: {
            usePolling: true,
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
