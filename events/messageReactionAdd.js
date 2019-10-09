const { RichEmbed } = module.require('discord.js');

class MessageReactionAdd {
    constructor(client) {
        this.client = client;
    }

    async run(reaction, user) {
        // Ignore reacts the bot sets
        if (user.bot === true) return;

        // Grab the original embedMessage
        let [ orgEmbed ] = reaction.message.embeds;

        // Ignore reactions not added to an activity
        if (orgEmbed.title === 'Crucible activiteit' || orgEmbed.title === 'Raid activiteit') {
            console.log(`${user.username} added their "${reaction.emoji.name}" reaction.`);

            let embedReactions = reaction.message.reactions;

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

            // Now we get the reacts and update the embed
            await embedReactions.get('✅').fetchUsers().then(users => {
                const participants = users.filter(user => !user.bot).map((user) => { return user.username });
                let participantsPrint = (participants.length > 0) ? participants.join('\r\n') : 'Geen';

                orgEmbed.fields[5].name = orgEmbed.fields[5].name.replace(/\(\d\/(\d+)\)/i,`(${participants.length}/$1)`);
                orgEmbed.fields[5].value = `\`\`\`${participantsPrint}\`\`\``;
            });

            await embedReactions.get('🕒').fetchUsers().then(users => {
                const reserves = users.filter(user => !user.bot).map((user) => { return user.username });
                let reservesPrint = (reserves.length > 0) ? reserves.join('\r\n') : 'Geen';

                orgEmbed.fields[6].name = orgEmbed.fields[6].name.replace(/\(\d\)/i,`(${reserves.length})`);
                orgEmbed.fields[6].value = `\`\`\`${reservesPrint}\`\`\``;
            });

            // Edit RichEmbed with new values
            reaction.message.edit(new RichEmbed(orgEmbed))
                .then(msg => console.log('Activity updated.'))
                .catch(console.error);
        }

        /**
         fields[0] = name
         fields[1] = note
         fields[2] = date
         fields[3] = maxplayers
         fields[4] = -BLANK-
         fields[5] = participants
         fields[6] = reserves
         **/

        // Update Participants
        // if (participants.length === 0) {
        //     orgEmbed.fields[5].value = '```Geen```';
        // }
        //
        // // Update Reserves
        // if (reserves.length === 0) {
        //     orgEmbed.fields[6].value = '```Geen```';
        // }
    }
}

module.exports = MessageReactionAdd;