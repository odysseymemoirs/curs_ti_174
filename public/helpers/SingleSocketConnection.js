
const socketConnection = {
    _instance: null,
    get instance() {
        if (!this._instance) {
            this._instance = io.connect();
        }
        return this._instance;
    }
}


