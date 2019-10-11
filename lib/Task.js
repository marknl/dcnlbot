const { RichEmbed } = module.require('discord.js');
const Moment = module.require('moment');

/**
 * Class Task
 * @class
 */
class Task {
    /**
     * @param {Client} client The client used in the command
     * @param {Object} options The command's configuration
     */
    constructor(client, options) {

        /**
         * The client used in the command
         * @type {client}
         */
        this.client = client;

        /**
         * The command's information properties
         * @type {Object}
         */
        this.help = {
            name: options.name || null,
            description: options.description || "No information specified.",
        };

        /**
         * The command's configuration
         * @type {Object}
         */
        this.conf = {
            delay: options.delay || 30000,
        };
    }
}

module.exports = Task;