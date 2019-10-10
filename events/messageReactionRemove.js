const { RichEmbed } = module.require('discord.js');

/**
 * Class MessageReactionRemove
 * @class
 */
class MessageReactionRemove {
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
     * @async
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User} user
     * @returns {Promise<void>}
     */
    async run(reaction, user) {
        // Ignore reacts the bot sets
        if (user.bot === true) return;

        // Grab the original embedMessage
        let [ orgEmbed ] = reaction.message.embeds;

        // Ignore reactions not added to an activity
        if (orgEmbed.title === 'Crucible activiteit' || orgEmbed.title === 'Raid activiteit') {
            console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);

            let embedReactions = reaction.message.reactions;

        }
    }
}

module.exports = MessageReactionRemove;