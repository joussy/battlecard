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
import { PropType } from "vue"

export default {
    name: "ShareComponent",
    props: {
        downloadCallback: {
            type: Function as PropType<(fileType: string) => Promise<void>>,
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
    computed: {
        tournamentId() {
            if (!this.tournamentStore.currentTournamentId) {
                throw new Error("No tournament selected")
            }
            return this.tournamentStore.currentTournamentId
        },
    },
    methods: {
        exportFile(fileType: string) {
            console.log(`Exporting as ${fileType}`)
            this.loadingFormat = fileType

            const promise: Promise<void> = this.downloadCallback(fileType)

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
                .catch((error) => {
                    console.error(`Error downloading ${fileType}:`, error)
                    this.loadingFormat = null
                })
        },
        async generateShareLink() {
            this.isGeneratingLink = true
            const roToken = await exportManager.generateFightCardRoToken(this.tournamentId)
            this.shareLink = `${window.location.origin}/#/shared-card/${roToken}`
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

/* .spinner-border-sm {
    width: 1rem;
    height: 1rem;
} */
</style>
