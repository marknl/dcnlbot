const Moment = module.require('moment');
const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

/**
 * Raid
 * @class
 * @extends Command
 */
class Raid extends Command {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        super(client, {
            name: "raid",
            category: "activity",
            cooldown: 2000,
            permission: "READ_MESSAGE"
        });

        this.data = GameMode.Raid();

        // Set usage
        this.help.description = 'Hoe maak ik een raid activiteit aan:';
        this.help.usage = `${this.client.config.prefix}raid <NAAM> <DATUM> <TIJD> <SPELERS> [NOTE]

<NAAM>      Moet een geldige raid naam zijn. Geldige modes zijn:
            ${Object.keys(this.data.mode).join(', ')}.

<DATUM>     Moet een geldige datum zijn. Datum formaat moet zijn: DD-MM-YYYY.
            Voorbeeld: ${Moment().format('DD-MM-YYYY')} voor ${Moment().format('LL')}.

<TIJD>      Moet een geldige tijd zijn. Tijd formaat moet zijn: HH:mm.
            Voorbeeld: ${Moment().format('HH:mm')} voor de huidige tijd.

<SPELERS>   Aantal spelers. Moet een geldig getal zijn.

[NOTE]      Deze optie kan gebruikt worden om een notitie toe te voegen aan de activiteit.
            Dit is een optioneel veld.`;
    }

    /**
     * Run the event
     * @param {Discord.Message} message
     * @param {Array} args
     * @returns {boolean}
     */
    run(message, args) {

        // Help requested, return help
        if (args[0] === 'help') { this.sendHelp(); return true; }

        if (this.validateInput('raid', args, this.data) === true) {

            let embed = this.createActivityEmbed('Raid', args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });

            return true;
        }
    }
}

module.exports = Raid;