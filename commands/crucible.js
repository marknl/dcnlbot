const Moment = module.require('moment');
const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

/**
 * Crucible
 * @class
 * @extends Command
 */
class Crucible extends Command {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        super(client, {
            name: "crucible",
            category: "activity",
            cooldown: 2000,
            permission: "READ_MESSAGE"
        });

        this.data = GameMode.Crucible();

        // Set usage
        this.help.description = 'Hoe maak ik een crucible activiteit aan:';
        this.help.usage = `${this.client.config.prefix}crucible <MODE> <DATUM> <TIJD> <SPELERS> [NOTE]

<MODE>      Moet een geldige crucible mode zijn. Geldige modes zijn:
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
     *
     * @param {Discord.Message} message
     * @param {Array} args
     * @returns {boolean}
     */
    run(message, args) {
        if (this.validateInput('crucible', args, this.data) === true) {

            if (args[0] === 'help') { this.sendHelp(); return true; }

            let embed = this.createActivityEmbed('Crucible', args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });

            return true;
        }
    }
}

module.exports = Crucible;