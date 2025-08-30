<template>
    <!-- Offcanvas -->
    <div
        ref="offcanvasEl"
        class="offcanvas offcanvas-end"
        tabindex="-1"
    >
        <div class="offcanvas-header">
            <slot name="header"></slot>
            <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Offcanvas } from "bootstrap"
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { onBeforeRouteLeave } from "vue-router"

const model = defineModel<boolean>()
const offcanvas = ref<Offcanvas | null>(null)
const offcanvasEl = ref<HTMLElement | null>(null)

watch(
    () => model.value,
    (newVal) => {
        if (newVal) {
            showOffcanvas()
        } else {
            hideOffcanvas()
        }
    }
)

onMounted(() => {
    if (!offcanvasEl.value) {
        throw new Error("Offcanvas element not found")
    }

    const el = offcanvasEl.value as HTMLElement
    offcanvas.value = Offcanvas.getOrCreateInstance(el as HTMLElement)

    el.addEventListener("show.bs.offcanvas", () => {
        model.value = true
    })
    el.addEventListener("hide.bs.offcanvas", () => {
        model.value = false
    })
})

// Navigation guard: close offcanvas when navigating away
onBeforeRouteLeave(() => {
    if (offcanvas.value) {
        offcanvas.value.hide()
    }
})

onBeforeUnmount(() => {
    if (offcanvas.value) {
        offcanvas.value.hide()
    }
})

function showOffcanvas() {
    if (!offcanvas.value) return
    offcanvas.value.show()
    model.value = true
}

function hideOffcanvas() {
    if (!offcanvas.value) return
    offcanvas.value.hide()
    model.value = false
}
</script>
