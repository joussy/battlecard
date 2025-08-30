<template>
    <div class="justify-content-center m-4 text-center">
        <div class="mb-4">
            <i>{{ $t("boxerImport.manyBoxers") }}</i>
        </div>
        <div class="mb-4">
            <i>{{ $t("boxerImport.favoriteFormat") }}</i>
        </div>
        <div>
            <button
                class="btn btn-outline-success"
                @click="redirectToImport"
            >
                <i class="bi bi-person-add me-2"></i>{{ $t("boxerImport.importBoxers") }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t: $t } = useI18n()
const router = useRouter()

const redirectToImport = () => {
    router.push({ name: "import" })
}
</script>
