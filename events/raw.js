class Raw {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        this.client = client;
        this.events = {
            MESSAGE_REACTION_ADD: 'messageReactionAdd',
            MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
        };
    }

    /**
     * Run the event
     * @param {JSON} event
     * @returns {Promise<void>}
     */
    async run(event) {
        if (!this.events.hasOwnProperty(event.t)) return;

        const { d: data } = event;
        const user = this.client.users.get(data.user_id);
        const channel = this.client.channels.get(data.channel_id);

        if (channel.messages.has(data.message_id)) return;

        const message = await channel.fetchMessage(data.message_id);

        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        let reaction = message.reactions.get(emojiKey);

        if (!reaction) {
            const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
            reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === this.client.user.id);
        }

        this.client.emit(this.events[event.t], reaction, user);
    }
}

module.exports = Raw;