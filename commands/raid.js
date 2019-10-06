const Discord = module.require("discord.js");
const Moment = module.require("moment");

module.exports.run = async (bot, msg, args) => {
    Moment.locale('nl');

    let data = bot.commands.get('raid').data;

    // Validate input
    if (args.length < 3) return msg.channel.send('Missing parameters.');

    // Check if args[0] is a valid raidname
    if (!data.raid.hasOwnProperty(args[0])) return msg.channel.send('Invalid raidname specified.');
    if (!Moment(args[1], 'DD-MM-YYYY').isValid()) return msg.channel.send('Invalid Date specified. (Must be of DD-MM-YYYY)');
    if (!Moment(args[2], 'HH:mm').isValid()) return msg.channel.send('Invalid Time specified. (Must be of HH:mm)');

    // Continue with valid input
    let raid = data.raid[args.shift()];
    let date = args.shift();
    let time = args.shift();
    let datetime = Moment(date+' '+time, 'DD-MM-YYYY HH:mm');
    let when = datetime.format('LLL');
    let note = args.join(' ');
    if (note === '') note = '-';

    let startsIn = datetime.toNow(true);

    let embed = new Discord.RichEmbed()
        .setColor(data.color) // depends on activity type? (green pve, red pvp)
        .setThumbnail(data.thumbnail)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .addField(raid.name, `Begint in \`${startsIn}\``, false)
        .addField('Notitie', note, false)
        .addField('Datum', `${when}`,true)
        .addField('Aantal spelers', raid.maxplayers, true)
        .addBlankField()
        .addField(`✅ Deelnemers (0/${raid.maxplayers})`, '```Geen```')
        .addField(`🕒 Wachtlijst (0)`, '```Geen```')
        .setFooter('Event starts')
        .setTimestamp(datetime);

    msg.channel.send(embed).then(async embedActivity => {
        await embedActivity.react('✅');
        await embedActivity.react('❎');
        await embedActivity.react('🕒');
    });

};

module.exports.data = {
    raid: {
        lev: {
            name: 'Leviathan',
            maxplayers: 6,
            thumbnail: ''
        },
        levpres: {
            name: 'Leviathan (Prestige)',
            maxplayers: 6,
            thumbnail: ''
        },
        eow: {
            name: 'Eater of Worlds',
            maxplayers: 6,
            thumbnail: ''
        },
        sos: {
            name: 'Spire of Stars',
            maxplayers: 6,
            thumbnail: ''
        },
        lw: {
            name: 'Last Wish',
            maxplayers: 6,
            thumbnail: ''
        },
        sotp: {
            name: 'Scourge of the Past',
            maxplayers: 6,
            thumbnail: ''
        },
        cos: {
            name: 'Crown of Sorrow',
            maxplayers: 6,
            thumbnail: ''
        },
        gos: {
            name: 'Garden of Salvation',
            maxplayers: 6,
            thumbnail: ''
        },
    },
    color: '#00ff00',
    thumbnail: 'http://vignette3.wikia.nocookie.net/destinypedia/images/2/26/Raid_Emblem.png'
};

module.exports.help = {
    name: "raid",
    usage: "raid <NAME> <DATE> <TIME> [NOTE]"
};