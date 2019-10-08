const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

class Crucible extends Command {
    constructor(client) {
        super(client, {
            name: "crucible",
            description: "Create a crucible event.",
            usage: "MODE DATE TIME (NOTE)",
            category: "activities",
            cooldown: 1000,
            permission: "READ_MESSAGE"
        });

        this.data = GameMode.Crucible();
    }

    run(message, args) {
        if (this.validateInput('crucible', args, this.data) === true) {

            let embed = this.createActivityEmbed('crucible', args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });
        }
    }
}

module.exports = Crucible;