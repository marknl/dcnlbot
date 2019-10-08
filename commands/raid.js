const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

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

        this.data = GameMode.Raid();
    }

    run(message, args) {
        if (this.validateInput('raid', message, args, this.data) === true) {
            let embed = this.createActivityEmbed('raid', message, args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });
        }
    }
}

module.exports = Raid;