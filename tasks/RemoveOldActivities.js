const Task = module.require('../lib/Task');
const Moment = module.require('moment');

/**
 * Class EmbedDateTime
 * @class
 * @extends Task
 */
class RemoveOldActivities extends Task {
    /**
     * Constructor
     * @param {Discord.Client} client
     */
    constructor(client) {
        super(client, {
            name: "RemoveOldActivities",
            description: "This task will remove activities over ${config.purgedays} old.",
            delay: 360000
        });
    }

    run(task) {
        console.log(`[TASK] ${task.help.name}: Start.`);
        let delCount = 0;
        task.client.channels.forEach(channel => {
            if (channel.type === "text" && channel.members.get(task.client.user.id)) {
                channel.fetchMessages({limit: 100})
                    .then(messages => {
                        let activityMsgs = messages.filter(msg => msg.author.id === task.client.user.id && msg.embeds.length === 1);
                        activityMsgs.forEach(activity => {
                            if (Moment().diff(activity.embeds[0].timestamp, "days") >= task.client.config.purgedays) {
                                activity.delete()
                                    .catch(console.error);
                                delCount++;
                            }
                        });

                    }).catch(console.error);
            }
        });
        console.log(`[TASK] ${task.help.name}: Deleted ${delCount} old messages.`);
        console.log(`[TASK] ${task.help.name}: End`);
    }
}

module.exports = RemoveOldActivities;