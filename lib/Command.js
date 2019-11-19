const { RichEmbed, Attachment } = module.require('discord.js');
const Moment = module.require('moment');

/**
 * Represents a command
 */
class Command {
    /**
     * @param {Client} client The client used in the command
     * @param {Object} options The command's configuration
     */
    constructor(client, options) {
        Moment.locale('nl');

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

    /**
     * Validate a activity input
     * @param {String} cmd
     * @param {Array} args
     * @param {Object} data
     * @returns {boolean}
     */
    validateInput(cmd, args, data) {
        // Help requested, no other validation required.
        if (args.length > 0 && args[0] === 'help') {
            return true;
        }

        let [activity, date, time, players] = args;

        // Input must at least have 4 parameters
        if (args.length < 4) {
            this.message.channel.send(`Er ontbreekt een parameter. Zie \`${this.client.config.prefix}${this.help.name} help\` voor hulp.`);
            return false;
        }

        // Validate activity
        if (!data.mode.hasOwnProperty(activity)) {
            this.message.channel.send(`\`${activity}\` is geen geldige activiteit.`);
            return false;
        }

        // Validate date
        if (!Moment(date, 'DD-MM-YYYY').isValid()) {
            this.message.channel.send(`\`${date}\` is geen geldige datum. (Formaat moet zijn: DD-MM-YYYY)`); return false;
        }

        // Validate time
        if (!Moment(time, 'HH:mm').isValid()) {
            this.message.channel.send(`\`${time}\` is geen geldige tijd. (Formaat moet zijn: HH:mm)`); return false;
        }

        // Validate if date/time is in the present
        if (!Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm').isAfter(Moment())) {
            this.message.channel.send(`\`${date} ${time}\` is geen geldig moment. (Kan geen activiteit in het verleden aanmaken)`); return false;
        }

        // Validate player count
        if (!Number.isInteger(Number(players))) { this.message.channel.send('Ongeldig aantal spelers opgegeven'); return false; }

        return true;
    }

    /**
     * Sends help information
     */
    sendHelp() {
        this.respondDm(`**${this.help.description}**`);
        this.respondDm(`\`\`\`${this.help.usage}\`\`\``);
        this.message.delete();
    }

    /**
     * Create an Activity Embed Object
     * @param {String} activity
     * @param {Array} args
     * @param {Object} data
     * @returns {RichEmbed}
     */
    createActivityEmbed(activity, args, data) {
        let mode = data.mode[args.shift()];
        let date = args.shift();
        let time = args.shift();
        let maxPlayers = args.shift();
        let note = args.join(' ');
        let datetime = Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
        let when = datetime.format('LLL');
        if (note === '') note = '-';

        let thumb = new Attachment(data.thumbnail, 'thumb.png');
        let flavor = new Attachment(mode.flavor, 'flavor.png');

        return new RichEmbed()
            .setColor(data.color)
            .attachFiles([thumb, flavor])
            .setThumbnail('attachment://thumb.png')
            .setAuthor(this.message.author.username, this.message.author.avatarURL)
            .setTitle(`${activity} activiteit`)
            .addField('Activiteit', `${mode.name}`, false)
            .addField('Notitie', note, false)
            .addField('Datum', `${when}`, true)
            .addField('Aantal spelers', maxPlayers, true)
            .addBlankField()
            .addField(`✅ Deelnemers (0/${maxPlayers})`, '```Geen```')
            .addField(`🕒 Wachtlijst (0)`, '```Geen```')
            .setFooter('Event starts')
            .setImage('attachment://flavor.png')
            .setTimestamp(datetime);
    }

    /**
     * Puts a user on cooldown
     * @param {String} user
     */
    startCooldown(user) {
        // Adds the user to the set
        this.cooldown.add(user);

        // Removes the user from the set after the cooldown is done
        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    /**
     * Sets the message
     * @param {Message|String} message
     */
    setMessage(message) {
        this.message = message;
    }

    /**
     * Sends the message to a channel
     * @param {Message|String} message
     */
    respond(message) {
        return this.message.channel.send(message);
    }

    /**
     * Sends the message to a user
     * @param {Message|String} message
     */
    respondDm(message) {
        return this.message.author.send(message);
    }
}

module.exports = Command;