const Moment = module.require('moment');

/**
 * Represents a command
 */
class Command {
    /**
     * @param {client} client The client used in the command
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
            usage: options.usage || "",
            category: options.category || "Information"
        };

        /**
         * The command's configuration
         * @type {Object}
         */
        this.conf = {
            permLevel: options.permLevel || 0,
            permission: options.permission || "SEND_MESSAGES",
            cooldown: options.cooldown || 1000,
            aliases: options.aliases || [],
            allowDMs: options.allowDMs || false
        };

        /**
         * A set of the IDs of the users on cooldown
         * @type {Set}
         */
        this.cooldown = new Set();
    }

    validateInput(cmd, args, data) {
        if (args.length < 3) return 'Missing parameters.';

        let activity = (cmd === 'raid') ? 'raid' : 'crucible mode';

        if (!data.hasOwnProperty(args[0])) return `Invalid ${activity} specified.`;
        if (!Moment(args[1], 'DD-MM-YYYY').isValid()) return 'Invalid Date specified. (Must be of DD-MM-YYYY)';
        if (!Moment(args[2], 'HH:mm').isValid()) return 'Invalid Time specified. (Must be of HH:mm)';

        return true;
    }

    /**
     * Puts a user on cooldown
     * @param {String} user The ID of the user to put on cooldown
     */
    startCooldown(user) {
        // Adds the user to the set
        this.cooldown.add(user);

        // Removes the user from the set after the cooldown is done
        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setMessage(message) {
        this.message = message;
    }

    respond(message) {
        return this.message.channel.send(message);
    }
}

module.exports = Command;