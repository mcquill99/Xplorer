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
        //this.load.audio('audioName', ['filepath/audio.mp3', 'filepath/audio.ogg]);
        // When loading audio files, you need both an mp3 and an ogg file because firefox cant read mp3 files

        this.load.image('black50', 'assets/test/black50.png');
        this.load.image('blue50', 'assets/test/blue50.png');
        this.load.image('darkGrey50', 'assets/test/darkGrey50.png');
        this.load.image('green20', 'assets/test/green20.png');
        this.load.image('green50', 'assets/test/green50.png');
        this.load.image('lightGrey50', 'assets/test/lightGrey50.png');
        this.load.image('red20', 'assets/test/red20.png');
        this.load.image('red50', 'assets/test/red50.png');
        this.load.image('white50', 'assets/test/white50.png');
        this.load.image('yellow20', 'assets/test/yellow20.png');
        this.load.image('yellow50', 'assets/test/yellow50.png');
        this.load.image("menuBack", 'assets/menu/menuBack.png');
        this.load.image('logo', 'assets/menu/logo.png');
        this.load.image('startBtn', 'assets/menu/start.png');

        this.load.json('testMap', 'data/testMap.json');

    },

    update: function() {
        this.state.start('Menu');
    }
};

