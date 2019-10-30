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
        if (args.length > 0 && args[0] === 'help') { return true; }

        if (args.length < 3) { this.message.channel.send('Missing parameters.'); return false; }

        const [ activity, date, time ] = args;

        if (!data.mode.hasOwnProperty(activity)) { this.message.channel.send(`Invalid ${activity} activity specified.`); return false; }
        if (!Moment(date, 'DD-MM-YYYY').isValid()) { this.message.channel.send('Invalid date specified. (Must be of DD-MM-YYYY)'); return false; }
        if (!Moment(time, 'HH:mm').isValid()) { this.message.channel.send('Invalid time specified. (Must be of HH:mm)'); return false; }
        if (!Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm').isAfter(Moment())) { this.message.channel.send('Invalid date specified. (Cannot schedule activity in the past.)'); return false; }

        return true;
    }

    /**
     * Sends help information
     */
    sendHelp() {
        this.respondDm(`**${this.help.description}**`);
        this.respondDm(`\`\`\`${this.help.usage}\`\`\``);
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
        let datetime = Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
        let when = datetime.format('LLL');
        let maxPlayers = (activity === 'custom') ? args.shift() : mode.maxplayers;
        let note = args.join(' ');
        if (note === '') note = '-';
        let startsIn = datetime.toNow(true);

        let thumbNail = new Attachment(data.thumbnail, 'thumbmail.png');
        let flavorImage = new Attachment(mode.image, 'flavor.png');

        // return new RichEmbed()
        //     .setColor(data.color) // depends on activity type? (green pve, red pvp, blue custom)
        //     //.attachFiles([thumbNail, flavorImage])
        //     //.setThumbnail('attachment://thumbmail.png')
        //     .setThumbnail('https://cdn.discordapp.com/attachments/622193351357235240/638655466167336961/thumbmail.png')
        //     .setAuthor(this.message.author.username, this.message.author.avatarURL)
        //     .setTitle(`${activity} activiteit`)
        //     .addField(mode.name, `Begint in \`${startsIn}\``, false)
        //     .addField('Notitie', note, false)
        //     .addField('Datum', `${when}`, true)
        //     .addField('Aantal spelers', maxPlayers, true)
        //     .addBlankField()
        //     .addField(`✅ Deelnemers (0/${maxPlayers})`, '```Geen```')
        //     .addField(`🕒 Wachtlijst (0)`, '```Geen```')
        //     .setFooter('Event starts')
        //     //.setImage('attachment://flavor.png')
        //     .setImage('https://cdn.discordapp.com/attachments/622193351357235240/638655465684729866/flavor.png')
        //     .setTimestamp(datetime);

        const i1 = new Attachment(data.thumbnail, 'thumbmail.png');
        const i2 = new Attachment(mode.image, 'flavor.png');

        return new RichEmbed()
            .setColor('#ff0000')
            .attachFiles([i1, i2])
            .setThumbnail('attachment://thumbnail.png')
            .setAuthor(this.message.author.username, this.message.author.avatarURL)
            .setTitle(`Some title`)
            .addField('Some text', false)
            .setImage('attachment://flavor.png')
            .setFooter('Event starts')
            .setTimestamp();
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