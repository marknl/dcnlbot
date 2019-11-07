const { RichEmbed } = module.require('discord.js');

/**
 * Class MessageReactionAdd
 * @class
 */
class MessageReactionAdd {
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

        console.log(`${user.username} added their "${reaction.emoji.name}" reaction.`);

        const embedReactions = reaction.message.reactions;

        // First react on the users' react and set the proper reacts.
        switch(reaction.emoji.name) {
            case '✅':
                await embedReactions.get('❎').remove(user);
                await embedReactions.get('🕒').remove(user);
                break;
            case '❎':
                await embedReactions.get('✅').remove(user);
                await embedReactions.get('🕒').remove(user);
                break;
            case '🕒':
                await embedReactions.get('✅').remove(user);
                await embedReactions.get('❎').remove(user);
                break;
        }

        // If a user subscribes for an event, check if there's a spot left
        if (reaction.emoji.name === '✅') {
            await embedReactions.get('✅').fetchUsers().then(users => {
                const participants = users.filter(user => !user.bot).map((user) => { return user.username });
                if (participants.length >= orgEmbed.fields[3].value) {
                    embedReactions.get('✅').remove(user);
                    reaction.message.channel.send(`Sorry ${user.username}! Deze activiteit is vol! Je kan jezelf nog wel aan de wachtlijst toevoegen.`)
                        .then(msg => { msg.delete(5000) })
                        .catch();
                }
            });
        }

        // Get the reacts and update the embed if we didn't hit max participants
        await embedReactions.get('✅').fetchUsers().then(users => {
            const participants = users.filter(user => !user.bot).map((user) => { return user.username });
            const participantsPrint = (participants.length > 0) ? participants.join('\r\n') : 'Geen';
            orgEmbed.fields[5].name = orgEmbed.fields[5].name.replace(/\(\d\/(\d+)\)/i,`(${participants.length}/$1)`);
            orgEmbed.fields[5].value = `\`\`\`
${participantsPrint}
\`\`\``;
        });

        await embedReactions.get('🕒').fetchUsers().then(users => {
            const reserves = users.filter(user => !user.bot).map((user) => { return user.username });
            const reservesPrint = (reserves.length > 0) ? reserves.join('\r\n') : 'Geen';
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

module.exports = MessageReactionAdd;