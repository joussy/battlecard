<template>
    <ModalComponent v-model="showModal">
        <template #header>
            <h5
                id="shareModalLabel"
                class="modal-title"
            >
                <i class="bi bi-share me-2"></i>
                Share
            </h5>
        </template>
        <!-- Export Section -->
        <h6 class="fw-bold mb-3">
            <i class="bi bi-download me-2"></i>
            {{ $t("share.downloadFormats") }}
        </h6>
        <div
            v-if="enableShareLink"
            class="form-check form-switch m-4"
        >
            <input
                id="displayQrCode"
                v-model="displayQrCode"
                class="form-check-input"
                type="checkbox"
                switch
            />
            <label
                for="displayQrCode"
                class="form-check-label"
            >
                {{ $t("share.withQrCode") }}
            </label>
        </div>
        <div class="d-flex flex-wrap justify-content-around">
            <div
                v-for="format in exportFormats"
                :key="format.type"
            >
                <button
                    class="btn align-items-center text-center"
                    @click="exportFile(format.type)"
                >
                    <span
                        :class="`btn btn-outline-${format.color} rounded-circle export-btn-circle`"
                        :disabled="loadingFormat === format.type"
                    >
                        <span
                            v-if="loadingFormat === format.type"
                            class="spinner-border spinner-border-sm mb-1"
                            role="status"
                        ></span>
                        <i
                            v-else
                            :class="`bi ${format.icon}`"
                        ></i>
                    </span>
                    <div class="mt-2 small fw-medium">{{ format.label }}</div>
                </button>
            </div>
        </div>

        <!-- Share Link Section -->
        <div v-if="enableShareLink">
            <!-- Divider -->
            <hr class="my-4" />

            <h6 class="fw-bold mb-3">
                <i class="bi bi-link-45deg me-2"></i>
                {{ $t("share.shareableLink") }}
            </h6>
            <p class="text-muted small mb-3">
                {{ $t("share.shareableLink") }}
            </p>

            <!-- Generate Link Button -->
            <div
                v-if="!shareLink"
                class="d-grid"
            >
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="isGeneratingLink"
                    @click="generateShareLink"
                >
                    <span
                        v-if="isGeneratingLink"
                        class="spinner-border spinner-border-sm me-3"
                        role="status"
                    ></span>
                    <i
                        v-else
                        class="bi bi-link me-2"
                    ></i>
                    {{ isGeneratingLink ? $t("common.loading") : $t("share.generateLink") }}
                </button>
            </div>

            <!-- Share Link Display -->
            <div
                v-if="shareLink"
                class="mt-3"
            >
                <label
                    for="shareLinkInput"
                    class="form-label small text-muted"
                >
                    {{ $t("share.shareableLink") }}:
                </label>
                <div class="input-group">
                    <input
                        id="shareLinkInput"
                        type="text"
                        class="form-control"
                        :value="shareLink"
                        readonly
                    />
                    <button
                        class="btn btn-outline-secondary no-hover-style"
                        type="button"
                        :title="linkCopied ? $t('share.linkCopied') : $t('share.copyLink')"
                        @click="copyShareLink"
                    >
                        <i
                            v-if="linkCopied"
                            class="bi bi-check-circle-fill text-success"
                        ></i>
                        <i
                            v-else
                            class="bi bi-clipboard"
                        ></i>
                    </button>
                </div>

                <!-- QR Code Display -->
                <div
                    v-if="qrCodePng"
                    class="d-flex mt-3"
                >
                    <img
                        :src="qrCodePng"
                        alt="QR Code for share link"
                        class="qr-code-image w-100"
                    />
                    <button
                        class="btn align-items-center text-center ms-3"
                        @click="downloadQrCode"
                    >
                        <span :class="`btn btn-outline-danger rounded-circle export-btn-circle`">
                            <i class="bi bi-download"></i>
                        </span>
                        <div class="mt-2 small fw-medium">{{ $t("share.downloadQrCode") }}</div>
                    </button>
                </div>
            </div>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { ShareOpenApi } from "@/api"
import { useTournamentStore } from "@/stores/tournament.store"
import ModalComponent from "./modal.component.vue"
const showModal = ref(false)
const { t: $t } = useI18n()

interface Props {
    downloadCallback: (fileType: string, displayQrCode: boolean) => Promise<void>
    enableShareLink: boolean
}

const props = defineProps<Props>()

// Reactive data
const loadingFormat = ref<string | null>(null)
const displayQrCode = ref(false)
const isGeneratingLink = ref(false)
const shareLink = ref("")
const qrCodePng = ref("")
const linkCopied = ref(false)

// Store
const tournamentStore = useTournamentStore()

// Static data
const exportFormats = [
    { type: "pdf", icon: "bi-file-earmark-pdf", label: "PDF", color: "danger" },
    { type: "xlsx", icon: "bi-file-earmark-spreadsheet", label: "Excel", color: "success" },
    { type: "csv", icon: "bi-file-earmark-text", label: "CSV", color: "info" },
    { type: "png", icon: "bi-file-image", label: "PNG", color: "warning" },
]

// Computed
const tournamentId = computed(() => {
    if (!tournamentStore.currentTournamentId) {
        throw new Error("No tournament selected")
    }
    return tournamentStore.currentTournamentId
})

// Methods
const exportFile = (fileType: string) => {
    console.log(`Exporting as ${fileType}`)
    loadingFormat.value = fileType

    const promise: Promise<void> = props.downloadCallback(fileType, displayQrCode.value)

    promise
        .then(() => {
            console.log(`Download completed for ${fileType}`)
            loadingFormat.value = null
            //wait for 1 second before hiding
            setTimeout(() => {
                showModal.value = false
            }, 700)
        })
        .catch((error: unknown) => {
            console.error(`Error downloading ${fileType}:`, error)
            loadingFormat.value = null
        })
}

const generateShareLink = async () => {
    isGeneratingLink.value = true
    const shared = await ShareOpenApi.generateFightCardToken({
        body: { tournamentId: tournamentId.value },
    })

    if (!shared) {
        console.error("Failed to generate share link")
        isGeneratingLink.value = false
        return
    }

    shareLink.value = shared.url
    qrCodePng.value = shared.qrcode
    isGeneratingLink.value = false
}

const copyShareLink = async () => {
    console.log("Copying share link")
    await navigator.clipboard.writeText(shareLink.value)
    linkCopied.value = true

    // Reset the copied state after 2 seconds
    setTimeout(() => {
        linkCopied.value = false
    }, 2000)
}

const downloadQrCode = () => {
    if (!qrCodePng.value) return

    // Create a temporary link element to trigger download
    const link = document.createElement("a")
    link.href = qrCodePng.value
    link.download = `qr-code-${tournamentId.value}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>

<style scoped>
.export-btn-circle {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
}

.input-group .form-control {
    font-family: "Courier New", monospace;
    font-size: 0.875rem;
}

.qr-code-image {
    max-width: 200px;
    max-height: 200px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 8px;
    background-color: white;
}
</style>
