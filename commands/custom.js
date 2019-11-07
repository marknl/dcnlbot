const Moment = module.require('moment');
const Command = require('../lib/Command');
const GameMode = new (require('../lib/GameMode'));

/**
 * Custom
 * @class
 * @extends Command
 */
class Custom extends Command {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        super(client, {
            name: "custom",
            category: "activity",
            cooldown: 2000,
            permission: "READ_MESSAGE"
        });

        this.data = GameMode.Custom();

        // Set usage
        this.help.description = 'Hoe maak ik een persoonlijke activiteit aan:';
        this.help.usage = `${this.client.config.prefix}custom <DATUM> <TIJD> <AANTAL> <NOTE>

<DATUM>     Moet een geldige datum zijn. Datum formaat moet zijn: DD-MM-YYYY.
            Voorbeeld: ${Moment().format('DD-MM-YYYY')} voor ${Moment().format('LL')}.

<TIJD>      Moet een geldige tijd zijn. Tijd formaat moet zijn: HH:mm.
            Voorbeeld: ${Moment().format('HH:mm')} voor de huidige tijd.

<AANTAL>    Het aantal spelers voor deze activiteit. (Moet een cijfer zijn)

<NOTE>      Deze optie bevat informatie over de persoonlijke activiteit.
            Dit veld is verplicht.`;
    }

    /**
     * Run the event
     * @param {Discord.Message} message
     * @param {Array} args
     * @returns {boolean}
     */
    run(message, args) {

        // The custom command doesn't have a activity name, so we inject it here, to bring it in line
        // with all other commands.
        // todo: Write separate validateion / createEmbed functions for each activity type.
        args.unshift('custom');

        if (this.validateInput('custom', args, this.data) === true) {

            if (args[0] === 'help') { this.sendHelp(); return true; }

            let embed = this.createActivityEmbed('Custom', args, this.data);

            super.respond(embed).then(async embedActivity => {
                await embedActivity.react('✅');
                await embedActivity.react('❎');
                await embedActivity.react('🕒');
            });
        }
    }
}

module.exports = Custom;