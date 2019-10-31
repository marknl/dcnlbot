/**
 * Class Message
 * @class
 */
class Message {
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
     * @param {Discord.Message} message
     * @returns {void | Promise<Channel> | Promise<Guild> | Promise<GuildChannel> | Promise<Invite> | Promise<Message> | Promise<PermissionOverwrites> | Promise<Role> | Promise<void> | boolean}
     */
    run(message) {
        // Ignore other bots, DM's and messages not starting with our prefix
        if (message.author.bot || message.channel.type === 'dm' || !message.content.startsWith(this.client.config.prefix)) return;

        const args = message.content.split(/\s+/g);
        const command = args.shift().slice(this.client.config.prefix.length);
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;
        if (cmd.cooldown.has(message.author.id)) return message.delete();

        cmd.setMessage(message);
        if (cmd.run(message, args) === true) {
            // Delete message
            //message.delete();
        }

        if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);
    }
}

module.exports = Message;