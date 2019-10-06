const Discord = module.require("discord.js");
const botSettings = require("./settings.json");
const helper = require("./helper.js");

console.log('Loading Dutch Collective Discord Bot...');

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
helper.loadCommand(bot);

bot.login(botSettings.token).then(() => {
    bot.user.setActivity('Code', {type: "WATCHING"}).then(() => {
        console.log('Activity set.')
    });
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is ready (prefix: ${botSettings.prefix})`);

    // try {
    //     let link = await bot.generateInvite("ADMINISTRATOR");
    //     console.log(`Invite link: ${link}`);
    // } catch (error) {
    //     console.log(error.stack);
    // }

    console.log(bot.commands)
});

bot.on("message", async message => {
    // Ignore other bots and DM's
    if (message.author.bot || message.channel.type === 'dm') return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (!command.startsWith(botSettings.prefix)) return;

    let cmd = bot.commands.get(command.slice(botSettings.prefix.length));
    if (cmd) cmd.run(bot, message, args);
});