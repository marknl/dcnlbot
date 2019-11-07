/**
 * Class Ready
 * @class
 */
class Ready {
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

    run() {
        this.client.setVersion();
        this.client.scheduleTasks();
    }

}

module.exports = Ready;