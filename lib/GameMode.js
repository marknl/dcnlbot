const gamemodes = require('../data/gamemodes');

class GameMode {

    Raid() {
        return gamemodes.raid;
    }

    Crucible() {
        return gamemodes.crucible;
    }
}

module.exports = GameMode;