const { RichEmbed } = module.require('discord.js');

class MessageReactionAdd {
    constructor(client) {
        this.client = client;
    }

    run(reaction, user) {
        // Ignore reacts the bot sets
        if (user.bot === true) return;

        console.log(`${user.username} added their "${reaction.emoji.name}" reaction.`);

        /**
         fields[0] = name
         fields[1] = note
         fields[2] = date
         fields[3] = maxplayers
         fields[4] = -BLANK-
         fields[5] = participants
         fields[6] = reserves
         **/
        let embed = reaction.message.embeds[0];
        let embedReactions = reaction.message.reactions;

        let participants = embedReactions.get('✅').users.map(user => {
            return (user.bot === false) ? user.username : null;
        });
        let reserves = embedReactions.get('🕒').users.map(user => {
            return (user.bot === false) ? user.username : null;
        });

        console.log(participants);
        console.log(reserves);

        // Update Participants
        embed.fields[5].name = embed.fields[5].name.replace(/\(\d\/(\d+)\)/i,`(${participants.length}/$1)`);
        if (participants.length === 0) {
            embed.fields[5].value = '```Geen```';
        } else {
            embed.fields[5].value = `\`\`\`${this.convArrayToNewLines(participants)}\`\`\``;
        }

        // Update Reserves
        embed.fields[6].name = embed.fields[6].name.replace(/\(\d\)/i,`(${reserves.length})`);
        if (reserves.length === 0) {
            embed.fields[6].value = '```Geen```';
        } else {
            embed.fields[6].value = `\`\`\`${this.convArrayToNewLines(reserves)}\`\`\``;
        }


        // Edit RichEmbed with new values
        reaction.message.edit(new RichEmbed(embed))
            .then(msg => console.log('Activity updated.'))
            .catch(console.error);
    }

    convArrayToNewLines(array) {
        return array.join('\r\n');
    }
}

module.exports = MessageReactionAdd;