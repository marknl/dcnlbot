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

        // Ignore reacts on messages not created by the bot
        if (reaction.message.author.bot === false) return;

        // Grab the original embedMessage
        let orgEmbed = new RichEmbed(reaction.message.embeds[0]);

        // Ignore reacts on non activity messages
        if (!orgEmbed.title) return;

        console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);

        let embedReactions = reaction.message.reactions;

        // Now we get the reacts and update the embed
        await embedReactions.get('✅').fetchUsers().then(users => {
            let participants = users.filter(user => !user.bot).map((user) => { return user.username });
            let participantsPrint = (participants.length > 0) ? participants.join('\r\n') : 'Geen';
            orgEmbed.fields[5].name = orgEmbed.fields[5].name.replace(/\(\d\/(\d+)\)/i,`(${participants.length}/$1)`);
            orgEmbed.fields[5].value = `\`\`\`
${participantsPrint}
\`\`\``;
        });

        await embedReactions.get('🕒').fetchUsers().then(users => {
            let reserves = users.filter(user => !user.bot).map((user) => { return user.username });
            let reservesPrint = (reserves.length > 0) ? reserves.join('\r\n') : 'Geen';
            orgEmbed.fields[6].name = orgEmbed.fields[6].name.replace(/\(\d\)/i,`(${reserves.length})`);
            orgEmbed.fields[6].value = `\`\`\`
${reservesPrint}
\`\`\``;
        });

        // Set images again, else the attachedFiles will be unreferenced and added outside of the embed.
        orgEmbed.setThumbnail('attachment://thumb.png');
        orgEmbed.setImage('attachment://flavor.png');

        // Edit RichEmbed with new values
        reaction.message.edit(orgEmbed)
            .catch(console.error);
    }
}

module.exports = MessageReactionRemove;