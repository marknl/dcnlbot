const Moment = module.require('moment');
const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

class Crucible extends Command {
    constructor(client) {
        super(client, {
            name: "crucible",
            category: "activity",
            cooldown: 1000,
            permission: "READ_MESSAGE"
        });

        this.data = GameMode.Crucible();

        // Set usage
        this.help.description = 'Hoe maak ik een crucible activiteit aan:';
        this.help.usage = `${this.client.config.prefix}crucible <MODE> <DATUM> <TIJD> [NOTE]

<MODE>      Moet een geldige crucible mode zijn. Geldige modes zijn:
            ${Object.keys(this.data.mode).join(', ')}.

<DATUM>     Moet een geldige datum zijn. Datum formaat moet zijn: DD-MM-YYYY.
            Voorbeeld: ${Moment().format('DD-MM-YYYY')} voor ${Moment().format('LL')}.

<TIJD>      Moet een geldige tijd zijn. Tijd formaat moet zijn: HH:mm.
            Voorbeeld: ${Moment().format('HH:mm')} voor de huidige tijd.

[NOTE]      Deze optie kan gebruikt worden om een notitie toe te voegen aan de activiteit.
            Dit is een optioneel veld.`;
    }

    run(message, args) {
        if (this.validateInput('crucible', args, this.data) === true) {

            if (args[0] === 'help') { this.sendHelp(); return true; }

            let embed = this.createActivityEmbed('Crucible', args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });
        }
    }
}

module.exports = Crucible;