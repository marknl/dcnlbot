class Warn {
    constructor(client) {
        this.client = client;
    }

    run(info) {
        console.warn(info);
    }
}

module.exports = Warn;