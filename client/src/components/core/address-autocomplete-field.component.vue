<template>
    <div class="mb-3">
        <label
            :for="id"
            class="form-label"
            >{{ label }}</label
        >
        <input
            :id="id"
            v-model="inputValue"
            type="text"
            class="form-control"
            :placeholder="placeholder"
            autocomplete="off"
            @input="onInput"
            @focus="showDropdown = true"
            @blur="hideDropdown"
        />
        <ul
            v-if="showDropdown && suggestions.length"
            class="list-group position-absolute w-100 z-3"
            style="max-height: 200px; overflow-y: auto"
        >
            <li
                v-for="(suggestion, idx) in suggestions"
                :key="idx"
                class="list-group-item list-group-item-action"
                @mousedown.prevent="selectSuggestion(suggestion)"
            >
                {{ formatSuggestion(suggestion) }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import apiManager from "@/managers/api.manager"
import { ApiAddressAutocompleteGet } from "@/shared/types/api"
import { PropType } from "vue"

export default {
    name: "AddressAutocompleteField",
    props: {
        id: { type: String as PropType<string>, required: true },
        label: { type: String as PropType<string>, required: true },
        placeholder: { type: String as PropType<string>, default: "Start typing address..." },
        modelValue: { type: String as PropType<string>, default: "" },
    },
    emits: ["update:modelValue", "select"],
    data(): {
        inputValue: string
        suggestions: ApiAddressAutocompleteGet[]
        showDropdown: boolean
        debounceTimeout: ReturnType<typeof setTimeout> | null
    } {
        return {
            inputValue: this.modelValue as string,
            suggestions: [] as ApiAddressAutocompleteGet[],
            showDropdown: false,
            debounceTimeout: null,
        }
    },
    watch: {
        modelValue(val: string) {
            this.inputValue = val
        },
    },
    methods: {
        onInput(): void {
            this.$emit("update:modelValue", this.inputValue)
            this.$emit("update:modelValue", this.inputValue)
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
            this.debounceTimeout = setTimeout(() => {
                if (this.inputValue.length < 3) {
                    this.suggestions = []
                    return
                }
                apiManager.getAutoCompleteAddress(this.inputValue).then((result: ApiAddressAutocompleteGet[]) => {
                    this.suggestions = result
                })
            }, 300)
        },
        selectSuggestion(suggestion: ApiAddressAutocompleteGet): void {
            this.inputValue = this.formatSuggestion(suggestion)
            this.$emit("update:modelValue", this.inputValue)
            this.$emit("select", suggestion)
            this.showDropdown = false
        },
        hideDropdown(): void {
            setTimeout(() => {
                this.showDropdown = false
            }, 200)
        },
        formatSuggestion(suggestion: ApiAddressAutocompleteGet): string {
            return `${suggestion.street || ""} ${suggestion.city || ""} ${suggestion.postcode || ""}`.trim()
        },
    },
}
</script>

<style scoped>
.list-group.position-absolute {
    top: 100%;
    left: 0;
}
</style>
