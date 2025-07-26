import path from "node:path"
import { fileURLToPath } from "node:url"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import vuePlugin from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import prettierPlugin from "eslint-plugin-prettier"
import globals from "globals"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
    // Vue 3 recommended rules
    ...vuePlugin.configs["flat/recommended"],

    // Main config for TS + Vue + Prettier
    {
        files: ["**/*.ts", "**/*.vue"],
        ignores: ["dist", "node_modules", "vite.config.ts"],
        languageOptions: {
            parser: vueParser,
            sourceType: "module",
            parserOptions: {
                parser: tsParser,
                ecmaVersion: "latest",
                sourceType: "module",
                extraFileExtensions: [".vue"],
                tsconfigRootDir: __dirname,
                project: "./tsconfig.json",
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            vue: vuePlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs["strict-type-checked"].rules,
            // Vue customizations
            "vue/multi-word-component-names": "off",
            "vue/no-unused-vars": "error",

            // TypeScript
            "@typescript-eslint/no-unused-vars": "error",
            "require-await": "error",

            // Prettier integration
            "prettier/prettier": "warn",
            "vue/html-indent": "off",
            "vue/script-indent": "off",
            "vue/html-self-closing": "off",
            "vue/singleline-html-element-content-newline": "off",
            "vue/html-closing-bracket-newline": "off",
        },
    },
]
