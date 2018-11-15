var XPlorer = {}; // This is making an object that will hold pretty much everything having to do with the game.

// Make a Preload, this will become the Phaser state
XPlorer.Preload = function(game) {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here
};

// Now we define the state
XPlorer.Preload.prototype = {
    preload: function() {
        //this.load.image('spriteName', 'filepath/image.png);
        //this.load.json('levelName', 'filepath/level.json');
    },

    update: function() {
        this.state.start('INSERT NEXT PHASE HERE') //TODO
    }
};

