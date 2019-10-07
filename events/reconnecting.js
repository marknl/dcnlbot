class Reconnecting {
    constructor(client) {
        this.client = client;
    }

    run() {
        console.log('Bot is reconnecting...');
    }
}

module.exports = Reconnecting;