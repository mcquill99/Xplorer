XPlorer.Game = function() {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here

};

// Initiate variables here
var tileWidth = 50,
    tileHeight = 50,
    tiles,
    actors,
    player,
    left,
    right,
    up,
    down,
    spacebar,
    playerSpeed = 200,
    greenResource = 0,
    redResource = 0,
    yellowResource = 0;


XPlorer.Game.prototype = {

    create: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // Create a tile group. This will hold all tiles and help with chunking later
        tiles = this.game.add.group();
        tiles.enableBody = true;
        tiles.physicsBodyType = Phaser.Physics.ARCADE;
        actors = this.game.add.group();
        actors.enableBody = true;
        actors.physicsBodyType = Phaser.Physics.ARCADE;

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        player = this.game.add.sprite(0, 0, 'blue50');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        // Makes the camera follow the player
        this.game.camera.follow(player);

        // Set up arrow key inputs
        left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
        down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebar.onDown.add(this.interact, this);

        // Capture the keys from the window
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);

        this.buildWorld();
    },


    update: function() {
        this.handleInput();
    },


    render: function() {
        this.game.debug.text('Green Resources:\t' + greenResource, 50, 50);
        this.game.debug.text('Red Resources: \t' + redResource, 50, 75);
        this.game.debug.text('Yellow Resources: \t' + yellowResource, 50, 100);
    },


    handleInput: function() {
        let horizontalDir = right.isDown - left.isDown;
        let verticalDir = down.isDown - up.isDown;

        player.body.velocity.x = horizontalDir * playerSpeed;
        player.body.velocity.y = verticalDir * playerSpeed;
    },


    buildWorld: function() {
        // Load the json file
        let level = this.game.cache.getJSON('testMap');

        this.game.world.setBounds(0, 0, level.tiles[0].length * tileWidth, level.tiles.length * tileHeight);

        /*
        tile array is populated by integers so it's easier to load. These integers will be
        converted to the image name of the tile so that we can use one function to create each one
        instead of having to make a function for each potential tile.
        Here is a legend for integer -> image name:
            0 = black50
            1 = darkGrey50
            2 = lightGrey50
            3 = white50
        */
        // Make the conversion array
        let integerToTileName = ['black50', 'darkGrey50', 'lightGrey50', 'white50'];

        // add the tiles into the world
        for(let i=0; i<level.tiles.length; i++) {
            for(let j=0; j<level.tiles[i].length; j++) {
                let tileName = integerToTileName[level.tiles[i][j]];
                let x = tileWidth * j,
                    y = tileWidth * i;
                let curTile = this.game.add.sprite(x, y, tileName);
                tiles.add(curTile);
                this.game.physics.enable(curTile, Phaser.Physics.ARCADE);
                //console.log(curTile);
                curTile.body.immovable = true;
            }
        }

        // Add the actors into the world
        /*
        We're doing the same thing we did for the tiles for the actors, converting integers to actor names.
        Here's the legend:
            0 = green20
            1 = red20
            2 = yellow20


        Phaser sprites have a "data" property which is unused in phaser, but allows us to associate some data with the
        sprite. In this case, we can store an object which will hold any information we need. the object will look like:
        {
            "onInteract": this.onActorInteract
        }

        this.onHit will be the function to be run when the actor is interacted with. It
         */
        let integerToActorName = ['green20', 'red20', 'yellow20'];
        let integerToActorResponse =[this.interactWithGreen, this.interactWithRed, this.interactWithYellow];

        for(let i=0; i<level.actors.length; i++) {
            let actorName = integerToActorName[level.actors[i].name];
            let x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            let curActor = this.game.add.sprite(x, y, actorName);
            actors.add(curActor);
            curActor.data.onInteract = integerToActorResponse[level.actors[i].name];
            this.game.physics.enable(curActor, Phaser.Physics.ARCADE);
            curActor.body.immovable = true;
        }
    },


    interact: function() {
        // Creates a hitbox that checks for actors in the world
        let hitbox = this.game.add.sprite(player.position.x, player.position.y, 'red50');
        hitbox.scale.setTo(1.2, 1.2);
        this.game.physics.enable(hitbox, Phaser.Physics.ARCADE);

        // Tells the physics system how to act if this collides with an actor.
        // NOTE: if it collides with multiple actors, it will run with hitActor for each actor hit
        this.physics.arcade.collide(hitbox, actors, this.interactWithActor, null, this);
        hitbox.destroy();
    },


    interactWithActor: function(player, actor) {
        actor.data.onInteract();
    },


    interactWithGreen: function() {
        greenResource++;
    },


    interactWithRed: function() {
        redResource++;
    },


    interactWithYellow: function() {
        yellowResource++;
    }



    
};