const Discord = module.require("discord.js");

module.exports.run = async (bot, msg, args) => {
    msg.channel.send('Let\'s create a crucible activity!');
    console.log(bot.commands.get('crucible').data);
};

module.exports.data = {
    gamemode: {
        clash: {
            maxplayers: 6,
            thumbnail: ''
        },
        labs: {
            maxplayers: 3,
            thumbnail: ''
        },
        showdown: {
            maxplayers: 4,
            thumbnail: ''
        },
        rumble: {
            maxplayers: 6,
            thumbnail: ''
        },
        control: {
            maxplayers: 6,
            thumbnail: ''
        },
        survival: {
            maxplayers: 3,
            thumbnail: ''
        },
        private: {
            maxplayers: 12,
            thumbnail: ''
        },
        ironbanner: {
            maxplayers: 6,
            thumbnail: ''
        },
        classic: {
            maxplayers: 6,
            thumbnail: ''
        },
    },
    color: '#ff0000',
    thumbnail: 'http://vignette1.wikia.nocookie.net/destiny/images/2/23/Schmelztiegel_Icon.png/revision/latest?path-prefix=de'
};

module.exports.help = {
    name: "crucible",
    usage: "crucible <MODE> <DATE> <TIME> [NOTE]"
};