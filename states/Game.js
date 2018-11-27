XPlorer.Game = function() {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here

};

// Initiate variables here
var tileWidth = 50,
    tileHeight = 50,
    canMove = 1,
    tiles,
    actors,
    player,
    left,
    right,
    up,
    down,
    space,
    playerSpeed = 200;


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

        // Capture the keys from the window
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
        this.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);

        this.press = 0; //variable to represent if the character is interacting with something

        this.bubble = this.game.add.sprite(1000,game.world.height-85,"textBox");
        this.bubble.enableBody = true;

        this.text1 = game.add.text(15, game.world.height - 80, '', { fontSize: '11px', fill: '#000000' });
        this.text2 = game.add.text(15, game.world.height - 69, '', { fontSize: '11px', fill: '#000000' });
        this.text3 = game.add.text(15, game.world.height - 58, '', { fontSize: '11px', fill: '#000000' });
        this.text4 = game.add.text(15, game.world.height - 47, '', { fontSize: '11px', fill: '#000000' });
        this.text5 = game.add.text(15, game.world.height - 36, '', { fontSize: '11px', fill: '#000000' });

        this.buildWorld();
    },


    update: function() {
        this.handleInput();
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
         */
        let integerToActorName = ['green20', 'red20', 'yellow20'];
        for(let i=0; i<level.actors.length; i++) {
            let actorName = integerToActorName[level.actors[i].name];
            let x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            let curActor = this.game.add.sprite(x, y, actorName);
            actors.add(curActor);
            this.game.physics.enable(curActor, Phaser.Physics.ARCADE);
            curActor.body.immovable = true;
        }
    },

    interact: function(){

        if(this.physics.arcade.distanceBetween(this.player, this.clerk) < 90 && this.spaceKey.isDown && Phaser.Math.isEven(this.press){
            this.bubble.x = 10;
            this.text1.text = "Welcome to the Beyond The Horizon Mini Mart!";
            this.text2.text = "What can I do for you sonny?";
            this.text3.text = 'Did the town mayor send another kid to pick up';
            this.text4.text = "his groceries again? Oh silly him! here, it looks like";
            this.text5.text = "you have just enough money for his usual, please bring this back!";

            canMove = 0;

            game.time.events.add(200, this.increment, this);

            money = 0;
            this.money.x = 1000;

            quest = 1;


        }
        if(this.spaceKey.isDown && Phaser.Math.isOdd(this.press)){
            this.bubble.x = -1000;
            this.text1.text = "";
            this.text2.text = "";
            this.text3.text = "";
            this.text4.text = "";
            this.text5.text = "";

            game.time.events.add(200, this.increment, this);
            canMove = 1;
            this.groceries.x = 490;

            this.cashier = game.add.audio('register');
            this.cashier.play();
            
        }
        
    }

    
};