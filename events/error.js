/**
 * Class Error
 * @class
 */
class Error {
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
     * @param {Error} error
     */
    run(error) {
        console.error(error);
    }
}

module.exports = Error;