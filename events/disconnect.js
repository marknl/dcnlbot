/**
 * Class Disconnect
 * @class
 */
class Disconnect {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        /**
         * Client object
         * @type {Discord.Client}
         */
        this.client = client;
    }

    /**
     * Run the event
     * @returns void
     */
    run() {
        console.warn('Bot is disconnecting...');
    }
}

module.exports = Disconnect;