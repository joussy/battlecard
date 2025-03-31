import * as bootstrap from "bootstrap"

class BootstrapSingleton {
    bootstrap: typeof bootstrap
    constructor() {
        this.bootstrap = bootstrap
    }

    getInstance() {
        return this.bootstrap
    }
}

const instance = new BootstrapSingleton()
export default instance
