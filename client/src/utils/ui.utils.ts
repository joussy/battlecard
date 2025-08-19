import bootstrap from "@/utils/bootstrap.singleton"

export function closeModal(instanceName: string) {
    const bsOffcanvas = bootstrap.getInstance().Offcanvas.getInstance(instanceName)
    if (bsOffcanvas) {
        bsOffcanvas.hide()
    }
}
export function openModal(instanceName: string) {
    const bsOffcanvas = bootstrap.getInstance().Offcanvas.getOrCreateInstance(instanceName)
    if (bsOffcanvas) {
        bsOffcanvas.show()
    }
}
