const Task = module.require('../lib/Task');

/**
 * Class EmbedDateTime
 * @class
 * @extends Task
 */
class EmbedDateTime extends Task {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        super(client, {
            name: "EmbedDateTime",
            description: "This task will update the date and time (left) on activities.",
            delay: 2000
        });
    }

    run(task) {
        console.log(`[TASK] ${task.help.name} triggered.`);
        // Find all embeds and update date / time
        //console.log(task.client.channels);
        clearInterval(this);
    }
}

module.exports = EmbedDateTime;