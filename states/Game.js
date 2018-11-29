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
        //the little cirlces are 'drops'
        drops = this.game.add.group();
        drops.enableBody = true;
        drops.physicsBodyType = Phaser.Physics.ARCADE;

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        player = this.game.add.sprite(970, 1100, 'blue50');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        //changes anchor to the middle of the player
        player.anchor.setTo(0.5,0.5);

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

        
        this.press = 0; //variable to represent if the character is interacting with something

        this.bubble = this.game.add.sprite(this.game.world.x+1000,this.game.world.y+10000,"textBox"); //adds text bubble off screen
        this.bubble.enableBody = true;

        //adds text lines but blank
        this.text1 = this.game.add.text(this.game.camera.x+30, this.game.camera.y+450, '', { fontSize: '30px', fill: '#000000' });
        this.text2 = this.game.add.text(this.game.camera.x+30, this.game.camera.y+480, '', { fontSize: '30px', fill: '#000000' });
        this.text3 = this.game.add.text(this.game.camera.x+30, this.game.camera.y+510, '', { fontSize: '30px', fill: '#000000' });
        this.text4 = this.game.add.text(this.game.camera.x+30, this.game.camera.y+540, '', { fontSize: '30px', fill: '#000000' });
        
        // Setting up timer for oxygen
        this.timeInSeconds = 25;
        this.timeText = this.game.add.text(this.game.camera.x - 100, this.game.camera.y, "0:00", { fontSize: '30px', fill: '#ffffff' });
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this); // timer event calls tick function for seconds 

        this.buildWorld();
    },


    update: function() {
        this.handleInput();
    },


    render: function() {
        this.game.debug.text('Green Resources:\t' + greenResource, 50, 50);
        this.game.debug.text('Red Resources: \t' + redResource, 50, 75);
        this.game.debug.text('Yellow Resources: \t' + yellowResource, 50, 100);
        this.game.debug.text(this.timeText.text, 50, 125);
    },


    handleInput: function() {
        if(canMove == 1){
            let horizontalDir = right.isDown - left.isDown;
            let verticalDir = down.isDown - up.isDown;

            player.body.velocity.x = horizontalDir * playerSpeed/((greenResource + redResource)/8 + 1);
            player.body.velocity.y = verticalDir * playerSpeed/((greenResource + redResource)/8 + 1);

        }
        else{
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
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
        sprite. In this case, we can store a function which will run when the actor is interacted with. 
         */
        let integerToActorName = ['green20', 'red20', 'yellow20'];
        let integerToActorResponse =[this.interactWithGreen, this.interactWithRed, this.textInteract];

        for(let i=0; i<level.actors.length; i++) {
            let actorName = integerToActorName[level.actors[i].name];
            let x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            let curActor = this.game.add.sprite(x, y, actorName);
            actors.add(curActor);
            curActor.data.onInteract = integerToActorResponse[level.actors[i].name];
            this.game.physics.enable(curActor, Phaser.Physics.ARCADE);
            curActor.body.immovable = true;
            //curActor.anchor.setTo(0.5,0.5);
        }
    },

    increment: function(){
        this.press = this.press + 1;

    },

    textInteract: function(){
        console.log(this.press);
        if(Phaser.Math.isEven(this.press)){
            this.bubble.x = this.game.camera.x +10;
            this.bubble.y = this.game.camera.y + 440;

            this.text1.x = this.game.camera.x+30;
            this.text1.y = this.game.camera.y+450;
            this.text2.x = this.game.camera.x+30;
            this.text2.y = this.game.camera.y+480;
            this.text3.x = this.game.camera.x+30;
            this.text3.y =this.game.camera.y+510;
            this.text4.x = this.game.camera.x+30;
            this.text4.y =this.game.camera.y+540;

            this.text1.text = "Welcome to the Beyond The Horizon Mini Mart!";
            this.text2.text = "What can I do for you sonny?";
            this.text3.text = 'Did the town mayor send another kid to pick up';
            this.text4.text = "his groceries again? Oh silly him! here, it looks like";

            canMove = 0;

            this.game.time.events.add(100, this.increment, this);
            // resets resources
            this.resetResources(); 
            
        }
        if(Phaser.Math.isOdd(this.press)){
            this.bubble.x = -10000;
            this.bubble.y = -10000;
            this.text1.text = "";
            this.text2.text = "";
            this.text3.text = "";
            this.text4.text = "";

            this.game.time.events.add(100, this.increment, this);
            canMove = 1;
        }
    },
       
    interact: function() {
        // Creates a hitbox that checks for actors in the world
        let hitbox = this.game.add.sprite(player.position.x, player.position.y);//, 'red50');
        hitbox.anchor.setTo(0.5,0.5);
        hitbox.scale.setTo(1.2, 1.2);
        this.game.physics.enable(hitbox, Phaser.Physics.ARCADE);

        // Tells the physics system how to act if this collides with an actor.
        // NOTE: if it collides with multiple actors, it will run with hitActor for each actor hit
        this.physics.arcade.collide(hitbox, actors, this.interactWithActor, null, this);
        //hitbox.destroy();
    },


    interactWithActor: function(player, actor) {
        actor.data.onInteract.call(this, actor);

    },


    interactWithGreen: function(actor) {
        greenResource++;
        //this.addDrop(actor.x,actor.y, "green");
        actors.remove(actor);
    },


    interactWithRed: function(actor) {
        redResource++;
        //this.addDrop(actor.x,actor.y, "red");
        actors.remove(actor);
    },


    interactWithYellow: function(actor) {
        yellowResource++;
        //this.addDrop(actor.x,actor.y, "yellow");
        actors.remove(actor);
    },
    
    addDrop: function(x,y, resource){
        let drop = this.game.add.sprite(x + 50, y, 'circle20');
        drop.data.resource = resource;
        drops.add(drop);
    },
    
    // Function to tick down time for the counter + formatting
    tick: function(){
        this.timeInSeconds--;
        var minutes = Math.floor(this.timeInSeconds / 60);
        var seconds = this.timeInSeconds - (minutes * 60);
        var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
        this.timeText.text = timeString;
        if (this.timeInSeconds == 0) { // This condition calls functions when timer hits 0
            this.game.time.events.remove(this.timer);
            this.timeText.text="Game Over";
            this.game.state.start('Game');
        }
    },
    
    // Function to add 0s to tome
    addZeros: function(num) {
        if (num < 10){
            num = "0" + num;
        }
        return num;
    },
    
    // Function to reset resources and timer
    resetResources: function(){
        this.timeInSeconds = this.timeInSeconds + 15;
        greenResource = 0;
        redResource = 0;
        yellowResource = 0;
    }
    
};