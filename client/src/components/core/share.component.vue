<template>
    <!-- Share Modal -->
    <div
        id="shareModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="shareModalLabel"
                        class="modal-title"
                    >
                        <i class="bi bi-share-fill me-2"></i>
                        Share & Export Fight Card
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body">
                    <!-- Export Section -->
                    <h6 class="fw-bold mb-3">
                        <i class="bi bi-download me-2"></i>
                        Download Fight Card
                    </h6>
                    <div class="row g-3">
                        <div
                            v-for="format in exportFormats"
                            :key="format.type"
                            class="col-3"
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
                                        class="spinner-border spinner-border-sm"
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

                    <!-- Divider -->
                    <hr class="my-4" />

                    <!-- Share Link Section -->
                    <div>
                        <h6 class="fw-bold mb-3">
                            <i class="bi bi-link-45deg me-2"></i>
                            Generate Shareable Link
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ExportService } from "@/services/export.service"
import { useTournamentStore } from "@/stores/tournament.store"

export default {
    name: "ShareComponent",
    data() {
        return {
            loadingFormat: null as string | null,
            isGeneratingLink: false,
            shareLink: "",
            linkCopied: false,
            tournamentStore: useTournamentStore(),
            exportFormats: [
                { type: "pdf", icon: "bi-file-earmark-pdf", label: "PDF", color: "danger" },
                { type: "xlsx", icon: "bi-file-earmark-spreadsheet", label: "Excel", color: "success" },
                { type: "csv", icon: "bi-file-earmark-text", label: "CSV", color: "info" },
                { type: "png", icon: "bi-file-image", label: "PNG", color: "warning" },
            ],
        }
    },
    methods: {
        exportFile(fileType: string) {
            console.log(`Exporting as ${fileType}`)
            this.loadingFormat = fileType
            if (!this.tournamentStore.currentTournamentId) {
                return
            }
            let promise: Promise<void>
            if (fileType === "xlsx") {
                promise = ExportService.downloadFightCardXlsx(this.tournamentStore.currentTournamentId)
            } else if (fileType === "csv") {
                promise = ExportService.downloadFightCardCsv(this.tournamentStore.currentTournamentId)
            } else if (fileType === "png") {
                promise = ExportService.downloadFightCardPng(this.tournamentStore.currentTournamentId)
            } else if (fileType === "pdf") {
                promise = ExportService.downloadFightCardPdf(this.tournamentStore.currentTournamentId)
            } else {
                console.error(`Unsupported file type: ${fileType}`)
                this.loadingFormat = null
                return
            }

            promise
                .then(() => {
                    console.log(`Download completed for ${fileType}`)
                    this.loadingFormat = null
                })
                .catch((error) => {
                    console.error(`Error downloading ${fileType}:`, error)
                    this.loadingFormat = null
                })
        },
        generateShareLink() {
            console.log("Generating share link")
            this.isGeneratingLink = true

            // Simulate API call delay
            setTimeout(() => {
                // Generate a fake share link
                const fakeToken =
                    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                this.shareLink = `${window.location.origin}/share/${fakeToken}`
                this.isGeneratingLink = false
            }, 1000)
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
    },
}
</script>

<style scoped>
.modal-body {
    padding: 1.5rem;
}

.btn {
    transition: all 0.2s ease-in-out;
}

div > .btn {
    transform: translateY(-1px);
}

.export-btn-circle {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.export-btn-circle:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.input-group .form-control {
    font-family: "Courier New", monospace;
    font-size: 0.875rem;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}
</style>
