const { Emoji, MessageReaction } = module.require('discord.js');

/**
 * Class Raw
 * @class
 */
class Raw {
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

        /**
         * Raw events to respond to
         * @type {{MESSAGE_REACTION_REMOVE: string, MESSAGE_REACTION_ADD: string}}
         */
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
        // See if we want to respond to this type of event
        if (!this.events.hasOwnProperty(event.t)) return;

        /**
         * Use the "d" property of the raw event to construct a user, channel and message object.
         * We need this to properly fire the actual event.
          */
        const { d: data } = event;
        const user = this.client.users.get(data.user_id);
        const channel = this.client.channels.get(data.channel_id);

        // Prevent re-emitting the event for the cached and uncached version of the message.
        if (channel.messages.has(data.message_id)) return;

        const message = await channel.fetchMessage(data.message_id);

        // Construct a proper emoji
        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

        // Fetch the reaction
        let reaction = message.reactions.get(emojiKey);
        if (!reaction) {
            const emoji = new Emoji(bot.guilds.get(data.guild_id), data.emoji);
            reaction = new MessageReaction(message, emoji, 1, data.user_id === this.client.user.id);
        }

        // Emit the event
        this.client.emit(this.events[event.t], reaction, user);
    }
}

module.exports = Raw;