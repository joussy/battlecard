<template>
    <!-- Share Modal -->
    <div
        id="shareModal"
        ref="shareModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="shareModalLabel"
                        class="modal-title"
                    ></h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body p-3">
                    <!-- Export Section -->
                    <h6 class="fw-bold mb-3">
                        <i class="bi bi-download me-2"></i>
                        Download Fight Card
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
                            Display a shareable QR Code in the download
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
                            Shareable Link
                        </h6>
                        <p class="text-muted small mb-3">
                            Create a read-only link that others can use to view this fight card without needing an
                            account.
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
                                {{ isGeneratingLink ? "Generating..." : "Generate Share Link" }}
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
                                Shareable Link:
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
                                    :title="linkCopied ? 'Copied!' : 'Copy to clipboard'"
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
                                    <div class="mt-2 small fw-medium">QR Code</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import exportManager from "@/managers/export.manager"
import { useTournamentStore } from "@/stores/tournament.store"
import bootstrap from "@/utils/bootstrap.singleton"
import { Modal } from "bootstrap"
import { PropType } from "vue"

export default {
    name: "ShareComponent",
    beforeRouteLeave(to, from, next) {
        // If you're using Vue Router
        if (this.modal) {
            this.modal.hide()
        }
        next()
    },
    props: {
        downloadCallback: {
            type: Function as PropType<(fileType: string, displayQrCode: boolean) => Promise<void>>,
            required: true,
        },
        enableShareLink: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            loadingFormat: null as string | null,
            displayQrCode: false,
            isGeneratingLink: false,
            shareLink: "",
            qrCodeSvg: "",
            qrCodePng: "",
            linkCopied: false,
            tournamentStore: useTournamentStore(),
            exportFormats: [
                { type: "pdf", icon: "bi-file-earmark-pdf", label: "PDF", color: "danger" },
                { type: "xlsx", icon: "bi-file-earmark-spreadsheet", label: "Excel", color: "success" },
                { type: "csv", icon: "bi-file-earmark-text", label: "CSV", color: "info" },
                { type: "png", icon: "bi-file-image", label: "PNG", color: "warning" },
            ],
            modal: null as Modal | null,
        }
    },
    computed: {
        tournamentId() {
            if (!this.tournamentStore.currentTournamentId) {
                throw new Error("No tournament selected")
            }
            return this.tournamentStore.currentTournamentId
        },
    },
    mounted() {
        // Keep a reference to the modal instance
        this.modal = Modal.getOrCreateInstance(this.$refs.shareModal as HTMLElement)
    },
    beforeUnmount() {
        // Close modal when component is destroyed
        if (this.modal) {
            this.modal.hide()
        }
    },
    methods: {
        exportFile(fileType: string) {
            console.log(`Exporting as ${fileType}`)
            this.loadingFormat = fileType

            const promise: Promise<void> = this.downloadCallback(fileType, this.displayQrCode)

            promise
                .then(() => {
                    console.log(`Download completed for ${fileType}`)
                    this.loadingFormat = null
                    //close the modal after download
                    const modal = document.getElementById("shareModal")
                    if (modal) {
                        const bsModal = bootstrap.getInstance().Modal.getInstance(modal)
                        if (bsModal) {
                            //wait for 1 second before hiding
                            setTimeout(() => {
                                bsModal.hide()
                            }, 700)
                        }
                    }
                })
                .catch((error: unknown) => {
                    console.error(`Error downloading ${fileType}:`, error)
                    this.loadingFormat = null
                })
        },
        async generateShareLink() {
            this.isGeneratingLink = true
            const shared = await exportManager.generateFightCardRoToken(this.tournamentId)
            this.shareLink = shared.url
            this.qrCodePng = shared.qrcode
            this.isGeneratingLink = false
        },
        async copyShareLink() {
            console.log("Copying share link")
            await navigator.clipboard.writeText(this.shareLink)
            this.linkCopied = true

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                this.linkCopied = false
            }, 2000)
        },
        downloadQrCode() {
            if (!this.qrCodePng) return

            // Create a temporary link element to trigger download
            const link = document.createElement("a")
            link.href = this.qrCodePng
            link.download = `qr-code-${this.tournamentId}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        },
    },
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

/* .spinner-border-sm {
    width: 1rem;
    height: 1rem;
} */
</style>
