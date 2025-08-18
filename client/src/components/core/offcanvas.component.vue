<template>
    <div
        :id="id"
        ref="offcanvasEl"
        class="offcanvas"
        :class="placementClass"
        tabindex="-1"
    >
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">{{ title }}</h5>
            <button
                type="button"
                class="btn-close"
                @click="close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Offcanvas } from "bootstrap"

export default {
    name: "Offcanvas",
    props: {
        id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "Menu",
        },
        placement: {
            type: String,
            default: "start", // start | end | top | bottom
        },
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:show"],
    data() {
        return {
            offcanvasInstance: null as Offcanvas | null,
        }
    },
    computed: {
        placementClass() {
            return `offcanvas-${this.placement}`
        },
    },
    watch: {
        show(newValue) {
            console.log("Show prop changed:", newValue)
            if (newValue) {
                this.open()
            } else {
                this.close()
            }
        },
    },
    mounted() {
        const htmlOffcanvas = this.$refs.offcanvasEl as HTMLElement
        this.offcanvasInstance = new Offcanvas(htmlOffcanvas)
        htmlOffcanvas.addEventListener("shown.bs.offcanvas", () => {
            this.$emit("update:show", true)
        })
        htmlOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
            console.log("offcanvas closed event triggered")
            this.$emit("update:show", false)
        })
    },
    methods: {
        open() {
            if (!this.offcanvasInstance) {
                console.error("Offcanvas instance is not initialized")
                return
            }
            console.log("Opening offcanvas")
            this.offcanvasInstance.show()
        },
        close() {
            if (!this.offcanvasInstance) {
                console.error("Offcanvas instance is not initialized")
                return
            }
            console.log("closing offcanvas")
            this.offcanvasInstance.hide()
        },
        toggle() {
            if (!this.offcanvasInstance) {
                console.error("Offcanvas instance is not initialized")
                return
            }
            this.offcanvasInstance.toggle()
        },
    },
}
</script>
