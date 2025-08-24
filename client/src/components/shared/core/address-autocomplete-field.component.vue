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
        class="autocomplete-items border"
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

<script setup lang="ts">
import { ref, watch } from "vue"
import { PlacesOpenApi, AddressAutocompleteDto } from "@/api"

interface Props {
    id: string
    label: string
    placeholder?: string
    modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: "Start typing address...",
    modelValue: "",
})

const emit = defineEmits<{
    "update:modelValue": [value: string]
    select: [suggestion: AddressAutocompleteDto]
}>()

const inputValue = ref(props.modelValue)
const suggestions = ref<AddressAutocompleteDto[]>([])
const showDropdown = ref(false)
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

watch(() => props.modelValue, (val: string) => {
    inputValue.value = val
})

const onInput = (): void => {
    emit("update:modelValue", inputValue.value)
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
    debounceTimeout.value = setTimeout(async () => {
        if (inputValue.value.length < 3) {
            suggestions.value = []
            return
        }
        try {
            const result = await PlacesOpenApi.autocomplete({
                query: { q: inputValue.value },
            })
            if (result) {
                suggestions.value = result
            }
        } catch (error) {
            console.error("Error fetching address suggestions:", error)
            suggestions.value = []
        }
    }, 300)
}

const selectSuggestion = (suggestion: AddressAutocompleteDto): void => {
    inputValue.value = suggestion.street
    emit("update:modelValue", inputValue.value)
    emit("select", suggestion)
    showDropdown.value = false
}

const hideDropdown = (): void => {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}
</script>
<style scoped>
.autocomplete-items div {
    padding: 10px;
    cursor: pointer;
}
</style>
