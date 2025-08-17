<template>
    <!-- Share Modal -->
    <div
        id="matchupModal"
        ref="matchupModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5
                        id="matchupModalLabel"
                        class="modal-title"
                    ></h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body p-3"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Modal } from "bootstrap"

export default {
    beforeRouteLeave(to, from, next) {
        // If you're using Vue Router
        if (this.modal) {
            this.modal.hide()
        }
        next()
    },
    props: {},
    data() {
        return {
            modal: null as Modal | null,
        }
    },
    computed: {},
    mounted() {
        // Keep a reference to the modal instance
        this.modal = Modal.getOrCreateInstance(this.$refs.matchupModal as HTMLElement)
    },
    beforeUnmount() {
        // Close modal when component is destroyed
        if (this.modal) {
            this.modal.hide()
        }
    },
    methods: {},
}
</script>

<style scoped></style>
