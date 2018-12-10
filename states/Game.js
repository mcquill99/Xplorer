XPlorer.Game = function() {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here

};

// Initiate variables here
var tileWidth = 46,
    tileHeight = 13,
    canMove = 1,
    tiles,
    actors,
    drops,
    player,
    ship,
    left,
    right,
    up,
    down,
    spacebar,
    playerSpeed = 200,
    resources = [0, 0], // [Green, Red]
    minDrops = 2,
    maxDrops = 5,
    dropMinOffset = -50,
    dropMaxOffset = 50,
    wordIndex = 0,
    lineIndex = 0,
    wordDelay = 120,
    lineDelay = 400,
    textIndex = 1,
    taskNum = 0,
    greenNeeded = 10,
    redNeeded = 5,
    resourceList = [];
    resourcesNeeded = [],
    resourceIndex = 0;
    inc = true;

    line = [];


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

        this.buildWorld();

        player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'blue50');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        ship = this.game.add.sprite(player.body.x - 200, player.body.y - 125, 'ship');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);


        //changes anchor to the middle of the player
        player.anchor.setTo(0.5,0.5);

        // Makes the camera follow the player
        this.game.camera.follow(player);
        this.game.world.bringToTop(player);

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
        this.text1 = this.game.add.text(this.game.camera.x+30, this.game.camera.y+450, '', { fontSize: '30px', fill: '#000000', wordWrap: true, wordWrapWidth: 910});
        this.text1.lineSpacing = -10;

        this.textCompare = this.game.add.text(this.game.width + 1000, this.game.height + 1000, '', { fontSize: '30px', fill: '#000000', wordWrap: true, wordWrapWidth: 910});
        this.textCompare.lineSpacing = -10;
        
        // Setting up timer for oxygen
        this.timeInSeconds = 25;
        this.timeText = this.game.add.text(this.game.camera.x - 100, this.game.camera.y, "0:00", { fontSize: '30px', fill: '#ffffff' });
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this); // timer event calls tick function for seconds 

        this.game.world.bringToTop(actors);
        this.game.world.bringToTop(this.bubble);
        this.game.world.bringToTop(this.text1);

        resourceList = this.game.cache.getJSON('text').resourceCount;
        resourcesNeeded = resourceList[resourceIndex];

    },


    update: function() {
        this.handleInput();

        //console.log('x: ' + player.body.x);
        //console.log('y: ' + player.body.y);

        this.physics.arcade.overlap(drops, player, this.pickUpDrop, null, this);
        this.physics.arcade.overlap(ship, player, this.stopTimer, null, this);
    },


    render: function() {
        this.game.debug.text('Green Resources:\t' + resources[0], 50, 50);
        this.game.debug.text('Red Resources: \t' + resources[1], 50, 75);
        this.game.debug.text(this.timeText.text, 50, 100);
    },


    handleInput: function() {
        if(canMove == 1){
            var horizontalDir = right.isDown - left.isDown;
            var verticalDir = down.isDown - up.isDown;

            player.body.velocity.x = horizontalDir * playerSpeed;
            player.body.velocity.y = verticalDir * playerSpeed;

        }
        else{
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
    },


    buildWorld: function() {
        // Load the json file
        var level = this.game.cache.getJSON('testMap');
        console.log(level);

        this.game.world.setBounds(0, 0, level.tiles[0].length * tileWidth + tileWidth / 2, level.tiles.length * tileHeight);

        this.buildTiles(level);
        //this.buildIsometricTiles(level);
        this.buildActors(level);

    },


    buildTiles: function(level) {
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
        var integerToTileName = ['black50', 'darkGrey50', 'lightGrey50', 'white50'];

        // add the tiles into the world
        for(var i=0; i<level.tiles.length; i++) {
            for(var j=0; j<level.tiles[i].length; j++) {
                var tileName = integerToTileName[level.tiles[i][j]];
                var x = tileWidth * j,
                    y = tileWidth * i;
                var curTile = this.game.add.sprite(x, y, tileName);
                tiles.add(curTile);
                this.game.physics.enable(curTile, Phaser.Physics.ARCADE);
                //console.log(curTile);
                curTile.body.immovable = true;
            }
        }
    },


    buildIsometricTiles: function(level) {
        var integerToTileName = ['grass1', 'grass2', 'grass3', 'grass3'];

        for(var i=0; i<level.tiles.length; i++)
            for(var j=0; j<level.tiles[i].length; j++) {
                var tileName = integerToTileName[level.tiles[i][j]];
                var x = tileWidth * j + (i%2) * tileWidth / 2;
                var y = tileHeight * i / 4;
                var curTile = this.game.add.sprite(x, y, tileName);
                tiles.add(curTile);
                this.game.physics.enable(curTile, Phaser.Physics.ARCADE);
                curTile.body.immovable = true;
            }

    },


    buildActors: function(level) {
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

        var integerToActorName = ['green20', 'red20', 'green20', 'yellow20'];
        var integerToActorResponse =[this.interactWithResource, this.interactWithResource, this.interactWithResource,this.textInteract];

        var integerToData = [
                function(curActor) {
                    curActor.data.resource = 0;
                    curActor.data.health = 3
                },
                function(curActor) {
                    curActor.data.resource = 1;
                    curActor.data.health = 4
                },
                function(curActor) { curActor.data.text = "test text" },
                function(curActor) {},
                function(curActor) { curActor.data.text = "test text" }
            ];

        for(var i=0; i<level.actors.length; i++) {
            var actorName = integerToActorName[level.actors[i].name];
            var x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            var curActor = this.game.add.sprite(x, y, actorName);
            actors.add(curActor);
            curActor.data.onInteract = integerToActorResponse[level.actors[i].name];
            integerToData[level.actors[i].name](curActor);
            this.game.physics.enable(curActor, Phaser.Physics.ARCADE);
            curActor.body.immovable = true;
            //curActor.anchor.setTo(0.5,0.5);
        }
    },

    hasResources: function(resoursesNeeded){
        if(resources[0] >= resourcesNeeded[0] && resources[1] >= resourcesNeeded[1]){
            return true;
        }
        else{
            return false;
        }

    },


    increment: function(){
        this.press = this.press + 1;

    },

    nextWord: function(){
        let dialogue = this.game.cache.getJSON('text')
        this.textCompare.text = this.textCompare.text.concat(line[wordIndex] + " ");

        if(wordIndex < line.length &&  this.textCompare.height < this.bubble.height){

            this.text1.text = this.text1.text.concat(line[wordIndex] + " ");

            wordIndex++;

        }
        if(lineIndex == dialogue.testText[textIndex].length-1 && wordIndex == line.length && inc == true){
            this.game.time.events.add(100, this.increment, this);
            inc = false;
        }
    },

    textInteract: function(){

        console.log(this.press);

        let dialogue = this.game.cache.getJSON('text');


        if(Phaser.Math.isEven(this.press)){
            this.bubble.x = this.game.camera.x +10;
            this.bubble.y = this.game.camera.y + 440;
            this.text1.x = this.game.camera.x+30;
            this.text1.y = this.game.camera.y+450;

            this.text1.text = "";
            this.textCompare.text = "";

            this.checkDialogue();

            line = dialogue.testText[textIndex][lineIndex].split(' ');


            if(wordIndex < line.length){
                this.game.time.events.add(100, this.increment, this);
                console.log("wordIndex < line.length");

            }


            if(wordIndex == line.length && lineIndex <  dialogue.testText[textIndex].length-1){
                lineIndex++;
                wordIndex = 0;

                this.game.time.events.add(100,this.increment,this);
                console.log("wordIndex == line.length");
            }


                line = dialogue.testText[textIndex][lineIndex].split(' ');



            this.game.time.events.repeat(wordDelay, line.length, this.nextWord, this);


            canMove = 0;

            this.game.time.events.add(100, this.increment, this); //increments press counter



            // resets resources 
            
        }
        if(Phaser.Math.isOdd(this.press)){
            this.bubble.x = -10000;
            this.bubble.y = -10000;
            this.text1.text = "";


            this.game.time.events.add(100, this.increment, this);
            canMove = 1;
            wordIndex = 0;
            lineIndex = 0;
            inc = true;
        }
    },

    checkDialogue: function(){
        if(this.hasResources(greenNeeded, redNeeded)){
            if(this.press != 0){
                textIndex = textIndex + 1;
                this.resetResources();
                if(resourceIndex != resourceList.length){
                    resourceIndex++;
                    resourcesNeeded = resourceList[resourceIndex];
                }
            }

        }
        else{
            if(this.press != 0 && wordIndex == 0 && lineIndex == 0){
                textIndex = 0;
            }
        }
    },
    
       
    interact: function() {
        // Creates a hitbox that checks for actors in the world
        var hitbox = this.game.add.sprite(player.position.x, player.position.y);//, 'red50');
        hitbox.anchor.setTo(0.5,0.5);
        hitbox.scale.setTo(1.2, 1.2);
        this.game.physics.enable(hitbox, Phaser.Physics.ARCADE);

        // Tells the physics system how to act if this collides with an actor.
        // NOTE: if it collides with multiple actors, it will run with hitActor for each actor hit
        this.physics.arcade.overlap(hitbox, actors, this.interactWithActor, null, this);
        //hitbox.destroy();
    },


    interactWithActor: function(player, actor) {
        actor.data.onInteract.call(this, actor);

    },


    /*
    This calls addDrops with the actors information.
     */
    interactWithResource: function(actor) {

        if(actor.data.health > 0) {
            actor.data.health--;
            this.playSound('chipResource');
        }
        else {
            this.addDrops(actor.position.x, actor.position.y, actor.data.resource, this.randIntBetween(minDrops, maxDrops));
            actor.destroy();
            this.playSound('breakResource');
        }
    },

    
    addDrops: function(x,y, resource, numOfDrops){
        for(numOfDrops; numOfDrops > 0; numOfDrops--) {
            var xOffset = this.randIntBetween(dropMinOffset, dropMaxOffset),
                yOffset = this.randIntBetween(dropMinOffset, dropMaxOffset);


            var drop = this.game.add.sprite(x + xOffset, y + yOffset, 'circle20');
            drop.data.resource = resource;
            drops.add(drop);
            this.game.physics.enable(drop, Phaser.Physics.ARCADE);
        }
    },


    pickUpDrop: function(player, drop) {
        console.log('pickup drop...');
        resources[drop.data.resource]++;
        drop.destroy();
    },

    checkForOverLap: function(spriteA, spriteB){
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    
    // Function to tick down time for the counter + formatting
    tick: function(){
        if(!this.checkForOverLap(player, ship)){
            this.timeInSeconds--;
        }

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
        if(this.timeInSeconds < 40){
            this.toAdd = 40-this.timeInSeconds;
            this.timeInSeconds = this.timeInSeconds + this.toAdd;
        }
        for(var i=0; i < resources.length; i++)
            resources[i] = 0;

    },


    randIntBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },


    /*
    Plays a sound with a given name
     */
    playSound: function(soundName) {
        var sound = this.add.audio(soundName);
        sound.play();
    }
    
};