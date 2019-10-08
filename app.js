/**
 * Dutch Collective Discord Bot
 */
const DCNLBot = module.require("./lib/DCNLBot");
console.log('Loading Dutch Collective Discord Bot...');
const Discord = module.require('discord.js');

// Initialise client
const bot = new DCNLBot({ config: "./config" });

// Login with config token
bot.login(bot.config.token);

// Load commands
bot.loadCommands(bot.config.paths.commands);

// Load events
bot.loadEvents(bot.config.paths.events);

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = bot.users.get(data.user_id);
    const channel = bot.channels.get(data.channel_id);

    if (channel.messages.has(data.message_id)) return;

    const message = await channel.fetchMessage(data.message_id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
        reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
    }

    bot.emit(events[event.t], reaction, user);
});