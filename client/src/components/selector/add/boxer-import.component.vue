<template>
    <div class="justify-content-center m-4 text-center">
        <div class="mb-4"><i>Many boxers to import ?</i></div>
        <div class="mb-4"><i>Import them using your favorite format !</i></div>
        <div>
            <button
                class="btn btn-outline-success"
                @click="redirectToImport"
            >
                <i class="bi bi-person-add me-2"></i>Import boxers
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { closeModal } from "@/utils/ui.utils"

const router = useRouter()

const closeModalFn = () => {
    closeModal("#boxerAddOffcanvasNavbar")
}

const redirectToImport = () => {
    closeModalFn()
    router.push({ name: "import" })
}
</script>
