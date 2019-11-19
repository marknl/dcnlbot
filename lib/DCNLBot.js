const { readdir } = require("fs");
const { Client, Collection } = require("discord.js");

/**
 * Class DCNLBot
 * @class
 * @extends Client
 */
class DCNLBot extends Client {
    /**
     * @param {Object} options The options passed to the client
     * @param {Object} options.clientOptions The client options used by the original discord.js client
     * @param {Object} options.config The filepath to the config file
     * @param {Object} options.perms The permission levels file
     */
    constructor(options) {
        // Initialise discord.js client with supplied client options
        super(options.clientOptions || {});

        /**
         * Bot version
         * @type {string}
         */
        this.version = '1.0.2';

        /**
         * A collection of all of the bot's commands
         * @type {Collection}
         */
        this.commands = new Collection();

        /**
         * A collection of all of the bot's tasks
         * @type {Collection}
         */
        this.tasks = new Collection();
        /**
         * A collection of all of the bot's command aliases
         * @type {Collection}
         */
        this.aliases = new Collection();

        // Client variables
        /**
         * The bot's configuration - empty if no file was specified
         * @type {Object}
         */
        this.config = options.config ? require(`../${options.config}`) : {};

        /**
         * The bot's permission levels
         * @type {Object}
         */
        this.perms = options.perms ? require(`../${options.perms}`) : {};

        /**
         * A collection of all of the activities planned
         * @type {Array}
         */
        this.activities = [];

        // Inform the user that the client has been initialised
        console.log(`Client initialised. You are using node ${process.version}.`);
    };

    /**
     * Logs the client in
     * @param {String} token The token used to log the client in
     */
    login(token) {
        // Log super in with the specified token
        super.login(token);

        // Return this client to allow chaining of function calls
        return this;
    }

    /**
     * Loads all commands in the directory
     * @param {String} path The path where the commands are located
     */
    loadCommands(path) {
        readdir(path, (err, files) => {
            if (err) console.log(err);
            let jsFiles = files.filter(f => f.split(".").pop() === "js");
            console.log(`Loading ${jsFiles.length} command(s) ..`);
            jsFiles.forEach(cmd => {
                const command = new (require(`../${path}/${cmd}`))(this);
                this.commands.set(command.help.name, command);
                command.conf.aliases.forEach(a => this.aliases.set(a, command.help.name));
            });
        });

        return this;
    }

    /**
     * Loads all events in the directory
     * @param {String} path The path where the events are located
     */
    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) console.log(err);
            let jsFiles = files.filter(f => f.split(".").pop() === "js");
            console.log(`Loading ${jsFiles.length} event(s) ..`);
            jsFiles.forEach(evt => {
                const event = new (require(`../${path}/${evt}`))(this);
                super.on(evt.split(".")[0], (...args) => event.run(...args));
            });
        });

        return this;
    }

    loadTasks(path) {
        readdir(path, (err, files) => {
            if (err) console.log(err);
            let jsFiles = files.filter(f => f.split(".").pop() === "js");
            console.log(`Loading ${jsFiles.length} task(s) ..`);
            jsFiles.forEach(evt => {
                const task = new (require(`../${path}/${evt}`))(this);
                this.tasks.set(task.name, task);
                //super.on(evt.split(".")[0], (...args) => task.run(...args));
            });
        });

        return this;
    }

    /**
     * Start all schedules tasks
     * @returns {DCNLBot}
     */
    scheduleTasks() {
        this.tasks.map((task) => {
            this.setInterval(task.run, task.conf.delay, task);
        });

        return this;
    }

    /**
     * Set the bot version as activity
     * @returns {boolean}
     */
    setVersion() {
        this.user.setActivity(`v${this.version}`, { type: 'PLAYING' })
            .then(() => console.log(`Setting activity: Playing v${this.version}`))
            .catch(console.error);

        return true;
    }
}

module.exports = DCNLBot;