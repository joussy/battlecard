<template>
    <input
        :id="id"
        v-model="inputValue"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        list="cityOptions"
        @input="onInput"
        @focus="showDropdown = true"
        @blur="hideDropdown"
    />
    <div
        v-if="showDropdown"
        class="autocomplete-items border bg-secondary"
    >
        <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @mousedown.prevent="selectSuggestion(suggestion)"
        >
            {{ suggestion.formatted }}
        </div>
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
    data() {
        return {
            inputValue: this.modelValue as string,
            suggestions: [] as ApiAddressAutocompleteGet[],
            showDropdown: false,
            debounceTimeout: null as ReturnType<typeof setTimeout> | null,
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
                    console.log("Suggestions:", result)
                    this.suggestions = result
                })
            }, 300)
        },
        selectSuggestion(suggestion: ApiAddressAutocompleteGet): void {
            this.inputValue = suggestion.street
            this.$emit("update:modelValue", this.inputValue)
            this.$emit("select", suggestion)
            this.showDropdown = false
        },
        hideDropdown(): void {
            setTimeout(() => {
                this.showDropdown = false
            }, 200)
        },
    },
}
</script>
<style scoped>
.autocomplete-items div {
    padding: 10px;
    cursor: pointer;
}
</style>
