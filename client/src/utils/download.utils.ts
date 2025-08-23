export function downloadWithDom(blob: Blob | File | undefined, filename: string) {
    if (!blob) {
        throw new Error(`No data to download!`)
    }
    if (typeof blob === "string") {
        blob = new Blob([blob as BlobPart])
    }
    try {
        // Create a temporary link element to trigger the download
        const link = document.createElement("a")
        const urlBlob = URL.createObjectURL(blob)
        link.href = urlBlob
        link.download = filename
        document.body.appendChild(link) // Attach link to the DOM
        link.click() // Trigger download
        document.body.removeChild(link) // Clean up the link
        URL.revokeObjectURL(urlBlob) // Release memory
    } catch (error) {
        console.error("Error downloading PDF:", error)
        throw error // Rethrow for further handling
    }
}
