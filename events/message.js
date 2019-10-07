class Message {
    constructor(client) {
        this.client = client;
    }

    run(message) {
        // Ignore other bots, DM's and messages not starting with our prefix
        if (message.author.bot || message.channel.type === 'dm' || !message.content.startsWith(this.client.config.prefix)) return;

        const args = message.content.split(/\s+/g);
        const command = args.shift().slice(this.client.config.prefix.length);
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;
        if (cmd.cooldown.has(message.author.id)) return message.delete();

        cmd.setMessage(message);
        cmd.run(message, args);

        // Delete message
        // message.delete();

        if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);
    }
}

module.exports = Message;