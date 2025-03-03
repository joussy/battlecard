export async function postAndDownload(url: string, payload: object | [], filename: string, headers: object) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Get the response as a Blob
        const blob = await response.blob()

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
