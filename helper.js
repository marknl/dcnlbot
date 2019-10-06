const Fs = module.require("fs");

function loadCommand(bot) {
    Fs.readdir("./commands/", (err, files) => {
        console.log(`Loading commands..`);
        if (err) console.error(err);

        let jsFiles = files.filter(f => f.split(".").pop() === "js");
        if (jsFiles.length > 0) {
            jsFiles.forEach((f, i) => {
                let props = require(`./commands/${f}`);
                console.log(`- ${f} loaded.`);
                bot.commands.set(props.help.name, props);
            });
        }
    });
}

function genericThumbnail() {
    return 'https://orig00.deviantart.net/ad07/f/2017/279/0/5/destiny_2_by_frostyhonky-dbpr9n8.png';
}

function genericColor() {
    return '#0000ff';
}

module.exports = {
    loadCommand,
    genericThumbnail,
    genericColor
};


// let cmdMsg = helper.parseMessage(message.content);
// console.log(cmdMsg.args.options);
//
// let embed = new Discord.RichEmbed()
//     .setColor(helper.pickActivityColor(cmdMsg.args.options.type)) // depends on activity type? (green pve, red pvp)
//     .setThumbnail(helper.pickActivityThumbnail(cmdMsg.args.options.type))
//     .setAuthor(message.author.username, message.author.avatarURL)
//     .addField(cmdMsg.args.options.name, 'Starts in `6 minutes`', false)
//     .addField('Date / Time', `${cmdMsg.args.options.date} ${cmdMsg.args.options.time}`, true)
//     .addField('Players', cmdMsg.args.options.players, true)
//     .addBlankField()
//     .addField(`✅ Participants (0/${cmdMsg.args.options.players})`, '```None```')
//     .addField(`🕒 Backup list (0)`, '```None```')
//     .setTimestamp();
//
// message.channel.send(embed).then(async embedActivity => {
//     await embedActivity.react('✅');
//     await embedActivity.react('❎');
//     await embedActivity.react('🕒');
// });