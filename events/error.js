class Error {
    constructor(client) {
        this.client = client;
    }

    run(error) {
        console.error(error);
    }
}

module.exports = Error;