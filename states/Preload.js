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
        this.load.spritesheet('circle20', 'assets/new/pickup.png', 25,25);
        this.load.image('red20', 'assets/test/red20.png');
        this.load.image('red50', 'assets/test/red50.png');
        this.load.image('white50', 'assets/test/white50.png');
        this.load.image('yellow20', 'assets/test/yellow20.png');
        this.load.image('yellow50', 'assets/test/yellow50.png');
        this.load.image('checkerboard50', 'assets/test/checkerboard50.png');
        this.load.spritesheet('ship', 'assets/new/shipInside.png', 384, 384);
        this.load.image('shipOutside', 'assets/new/shipOutside.png');
        this.load.image('transparent', 'assets/new/transparent.png');
        this.load.image('shipOutside', 'assets/new/shipOutside.png');
        this.load.image('redParticle1', 'assets/test/redParticle1.png');
        this.load.image('redParticle2', 'assets/test/redParticle2.png');
        this.load.image('redParticle3', 'assets/test/redParticle3.png');
        this.load.image('greenParticle1', 'assets/test/greenParticle1.png');
        this.load.image('greenParticle2', 'assets/test/greenParticle2.png');
        this.load.image('greenParticle3', 'assets/test/greenParticle3.png');
        this.load.image('transparent', 'assets/new/transparent.png');
        this.load.image('transparent1x250', 'assets/new/transparent1x250.png');
        this.load.image('transparent400x1', 'assets/new/transparent400x1.png');
        this.load.image('timerCover', 'assets/new/oxygen_tank.png');
        this.load.image('timerBar', 'assets/new/bar.png');
        this.load.image('sidebar', 'assets/new/sidebar.png');
        this.load.spritesheet('mo','assets/new/moSteele.png',64,64);
        this.load.spritesheet('shipInside', 'assets/new/shipInside.png',90,90);
        this.load.spritesheet('enemy', 'assets/new/critter.png', 42,60);
        this.load.image('blackInsideShip', 'assets/new/blackInsideShip.png');

        //this.load.image('grass1', 'assets/new/grass_tile_1.png');
        this.load.image('grass1', 'assets/new/grass_tile_1_scaled.png');
        this.load.image('grass2', 'assets/new/grass_tile_2_scaled.png');
        this.load.image('grass3', 'assets/new/grass_tile_3_scaled.png');
        this.load.image('grass4', 'assets/new/grass_tile_4_scaled.png');
        this.load.image('grass5', 'assets/new/grass_tile_5_scaled.png');
        this.load.spritesheet('resourceBlue', 'assets/new/resource_blue.png', 26,27);
        this.load.spritesheet('resourceOrange', 'assets/new/resource_orange.png',38,34);
        this.load.spritesheet('resourceRed', 'assets/new/resource_red.png',27,27);
        this.load.spritesheet('resourcePink', 'assets/new/resource_pink.png',63,63);
        this.load.image('rock1', 'assets/new/rock_big_1.png');
        this.load.image('rock2', 'assets/new/rock_big_2.png');
        this.load.image('rock3', 'assets/new/rock_big_3.png');
        this.load.image('rock4', 'assets/new/rock_big_4.png');
        this.load.image('rock5', 'assets/new/rock_big_5.png');
        this.load.image('curtain', 'assets/new/curtain.png');

        this.load.image("menuBack", 'assets/menu/menuBack.png');
        this.load.image('logo', 'assets/menu/logo.png');
        this.load.image('startBtn', 'assets/menu/start.png');
        this.load.image('textBoxMo', 'assets/new/mo_textBubble.png');
        this.load.image('textBoxEve', 'assets/new/eve_textBubble.png');
        this.load.spritesheet('stun', 'assets/new/stun_animation.png', 51,51);
        
        this.load.json('testMap', 'data/testMap.json');
        this.load.json('testMap3', 'data/testWorld30+15x60.json');
        this.load.json('text', 'data/text.json');
        this.load.json('finalMap', 'data/finalWorld.json')

        this.load.audio('chipResource', ['assets/sounds/Ice_impact_lite_02 (online-audio-converter.com).mp3',
            'assets/sounds/Ice_impact_lite_02 (online-audio-converter.com).ogg']);
        this.load.audio('breakResource', ['assets/sounds/RockCrumble.mp3', 'assets/sounds/RockCrumble.ogg']);
        this.load.audio('ambiance', ['assets/sounds/ambientForestNoises.mp3', 'assets/sounds/ambientForestNoises.ogg']);
        this.load.audio('hit', ['assets/sounds/hit.mp3', 'assets/sounds/hit.ogg']);
        this.load.audio('enemyDestroyed', ['assets/sounds/enemyDestroyed.mp3', 'assets/sounds/enemyDestroyed.ogg']);

    },

    create: function() {
        this.state.start('Game');
    }
};

