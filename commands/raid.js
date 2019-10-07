const { RichEmbed } = module.require('discord.js');
const Moment = module.require('moment');
const Command = require('../lib/Command');

class Raid extends Command {
    constructor(client) {
        super(client, {
            name: "raid",
            description: "Create a raid event.",
            usage: "NAME DATE TIME (NOTE)",
            category: "activities",
            cooldown: 1000,
            permission: "READ_MESSAGE"
        });
        this.data = require('../data/raid');
    }

    run(message, args) {
        Moment.locale('nl');

        let retValue = this.validateInput('raid', args, this.data);
        if (retValue === true) {
            // Continue with valid input
            let raid = this.data.raid[args.shift()];
            let date = args.shift();
            let time = args.shift();
            let datetime = Moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
            let when = datetime.format('LLL');
            let note = args.join(' ');
            if (note === '') note = '-';

            let startsIn = datetime.toNow(true);

            let embed = new RichEmbed()
                .setColor(this.data.color) // depends on activity type? (green pve, red pvp)
                .setThumbnail(this.data.thumbnail)
                .setAuthor(message.author.username, message.author.avatarURL)
                .addField(raid.name, `Begint in \`${startsIn}\``, false)
                .addField('Notitie', note, false)
                .addField('Datum', `${when}`, true)
                .addField('Aantal spelers', raid.maxplayers, true)
                .addBlankField()
                .addField(`✅ Deelnemers (0/${raid.maxplayers})`, '```Geen```')
                .addField(`🕒 Wachtlijst (0)`, '```Geen```')
                .setFooter('Event starts')
                .setTimestamp(datetime);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });
        } else {
            // show help
            message.channel.send(retValue);
        }
    }
}

module.exports = Raid;