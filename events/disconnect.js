class Disconnect {
    constructor(client) {
        this.client = client;
    }

    run() {
        console.warn('Bot is disconnecting...');
    }
}

module.exports = Disconnect;