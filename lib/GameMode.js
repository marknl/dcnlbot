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

    Custom() {
        return gamemodes.custom;
    }
}

module.exports = GameMode;
