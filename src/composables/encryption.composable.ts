export async function decryptStore(
    cryptoKey: CryptoKey,
    base64EncryptedStore: string
): Promise<{ decryptedPayload: string; cryptoKey: CryptoKey }> {
    // Base64 -> ArrayBuffer
    const encryptedArrayBuffer = Uint8Array.from(atob(base64EncryptedStore), (c) => c.charCodeAt(0))
    // Encrypted ArrayBuffer -> Decrypted ArrayBuffer
    const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(12) },
        cryptoKey,
        encryptedArrayBuffer
    )
    //Decrypted ArrayBuffer -> Text
    const decryptedPayload = new TextDecoder("utf-8").decode(decryptedArrayBuffer)
    return { decryptedPayload, cryptoKey }
}

export async function encryptStore(store: string, cryptoKey: CryptoKey): Promise<string> {
    //Store -> ArrayBuffer
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: new Uint8Array(12) /* don't reuse key! */ },
        cryptoKey,
        new TextEncoder().encode(store)
    )
    //Array Buffer -> Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    return base64
}
export async function getOrCreateCryptoKeyWithUrl(): Promise<CryptoKey> {
    let cryptoKey: CryptoKey
    let keyText: string | undefined = window.location.hash.slice("#key=".length)
    if (keyText) {
        //Reading Anchor
        console.log(`key recovered from anchor: ${keyText}`)
        // Anchor -> Cryptokey
        cryptoKey = await window.crypto.subtle.importKey(
            "jwk",
            {
                k: keyText,
                alg: "A128GCM",
                ext: true,
                key_ops: ["encrypt", "decrypt"],
                kty: "oct",
            },
            { name: "AES-GCM", length: 128 },
            false, // extractable
            ["encrypt", "decrypt"]
        )
    } else {
        //Generates cryptokey
        cryptoKey = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 128 },
            true, // extractable
            ["encrypt", "decrypt"]
        )
        //CryptoKey -> text
        keyText = (await window.crypto.subtle.exportKey("jwk", cryptoKey)).k
        location.hash = `#key=${keyText}`
        console.log(`new key added to anchor: ${keyText}`)
    }

    return cryptoKey
}

export async function testEncryptionStore() {
    const cryptoKey = await getOrCreateCryptoKeyWithUrl()
    const store = localStorage.getItem("store")
    console.log({ cryptoKey, store })
    if (store) {
        const base64 = await encryptStore(store, cryptoKey)
        const { decryptedPayload } = await decryptStore(cryptoKey, base64)
        console.log(`decrypted Payload: ${decryptedPayload}`)
    }
}
