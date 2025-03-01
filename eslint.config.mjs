import typescriptEslint from "@typescript-eslint/eslint-plugin"
import prettier from "eslint-plugin-prettier"
import parser from "vue-eslint-parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/base",
        "plugin:vue/vue3-essential",
        "plugin:vue/vue3-recommended",
        "plugin:vue/vue3-strongly-recommended",
        "prettier"
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier,
        },

        languageOptions: {
            parser: parser,
            ecmaVersion: 2020,
            sourceType: "module",

            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },

        rules: {
            "prettier/prettier": "warn",
            "vue/require-v-for-key": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "vue/no-unused-vars": "warn",
            "require-await": "error",
        },
    },
]
