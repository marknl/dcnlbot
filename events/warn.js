/**
 * Class Warn
 * @class
 */
class Warn {
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
     * @param {String} info
     */
    run(info) {
        console.warn(info);
    }
}

module.exports = Warn;