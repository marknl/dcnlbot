const gamemodes = require('../data/gamemodes');

class GameMode {

    Raid() {
        return gamemodes.raid;
    }

    Crucible() {
        return gamemodes.crucible;
    }

    Gambit() {
        return gamemodes.gambit;
    }
}

module.exports = GameMode;