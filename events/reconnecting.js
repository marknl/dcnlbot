/**
 * Class Reconnecting
 * @class
 */
class Reconnecting {
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
        console.log('Bot is reconnecting...');
    }
}

module.exports = Reconnecting;