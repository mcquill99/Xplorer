XPlorer.Game = function() {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here

};

// Initiate variables here
var tileWidth = 96,
    tileHeight = 52,
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
    enemySpeed = 175,
    enemyRange = 200,
    resources = [0, 0], // [Green, Red]
    resourceEmitters = [null, null],
    emitters,
    enemies,
    resourceParticles = [['greenParticle1', 'greenParticle2', 'greenParticle3'], ['redParticle1', 'redParticle2', 'redParticle3']],
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
    inc = true,
    collision,
    tilesRendered,
    tilesArray,
    timeArray = [],
    resourceList = [],
    resourcesNeeded = [],
    resourceIndex = 0,
    inc = true,
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

        emitters = this.game.add.group();

        collision = this.game.add.group();
        collision.enableBody = true;
        collision.physicsBodyType = Phaser.Physics.ARCADE;

        enemies = this.game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.buildWorld();

        player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'mo');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        ship = this.game.add.sprite(player.body.x - 200, player.body.y - 125, 'ship');
        ship.enableBody = true;
        this.game.physics.enable(ship, Phaser.Physics.ARCADE);

        this.createCollision();

        this.addAnimations();

        //this.addEnemies();

        this.enemy = this.game.add.sprite(ship.body.x - 200, ship.body.y, 'green50');
        enemies.add(this.enemy);
        this.enemy.data.direction = -1;

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
        timeArray = this.game.cache.getJSON('text').oxygenTime[0];
        this.timeInSeconds = timeArray[resourceIndex];
        this.timeText = this.game.add.text(this.game.camera.x - 100, this.game.camera.y, "0:00", { fontSize: '30px', fill: '#ffffff' });
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this); // timer event calls tick function for seconds 

        this.game.world.bringToTop(actors);
        this.game.world.bringToTop(this.bubble);
        this.game.world.bringToTop(this.text1);

        this.buildEmitters();
        resourceList = this.game.cache.getJSON('text').resourceCount;
        resourcesNeeded = resourceList[resourceIndex];

        this.timer2 = this.game.time.events.loop(1000, this.flipEnemyDir, this);

    },


    update: function() {
        this.handleInput();

        //console.log('x: ' + player.body.x);
        //console.log('y: ' + player.body.y);

        this.physics.arcade.overlap(drops, player, this.pickUpDrop, null, this);
        this.physics.arcade.collide(player, collision, this.stopPlayer,null, this);

        var distance = this.physics.arcade.distanceBetween(this.enemy , player);


        if(distance <= enemyRange){
            this.attackState();
        }
        else{
            this.paceState();
        }

    },


    render: function() {
        this.game.debug.text('Green Resources:\t' + resources[0], 50, 50);
        this.game.debug.text('Red Resources: \t' + resources[1], 50, 75);
        this.game.debug.text(this.timeText.text, 50, 100);
    },


    //handles player input and decides which way the player will go
    handleInput: function() {
        if(canMove == 1){
            var horizontalDir = right.isDown - left.isDown;
            var verticalDir = down.isDown - up.isDown;

            player.body.velocity.x = horizontalDir * playerSpeed;
            player.body.velocity.y = verticalDir * playerSpeed;

            if(horizontalDir == -1){

                if(verticalDir != 1 && verticalDir != -1){
                    player.animations.play('left');
                    this.stopFrame = 1;
                }
            }

            if(horizontalDir == 1){

                if(verticalDir != 1 && verticalDir != -1){
                    player.animations.play('right');
                    this.stopFrame = 6;
                }
            }

            if(verticalDir == -1){
                player.animations.play('up');
                this.stopFrame = 13;
            }

            if(verticalDir == 1){
                player.animations.play('down');
                this.stopFrame = 0;
            }

            if(horizontalDir == 0 && verticalDir == 0){
                player.animations.stop();
                player.frame = this.stopFrame;
            }

        }
        else{
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.animations.stop();
            player.frame = 1;
        }
    },


    //adds player animations
    addAnimations: function(){
        player.animations.add('left', [1,2,3,4],10, true);
        player.animations.add('right', [6,7,8,9], 10, true);
        player.animations.add('down', [0,11,12], 10, true);
        player.animations.add('up', [13,14,15], 10, true);
    },

    //adds enemies to the level
    addEnemies: function(){
        this.enemy = this.game.add.sprite(ship.body.x - 200, ship.body.y, 'green50');
        enemies.add(this.enemy);
        this.enemy.data.direction = -1;
        
    },

    //Base state for enemies
    paceState: function(){
        this.enemy.body.velocity.x = 0
        this.enemy.body.velocity.y = enemySpeed * this.enemy.data.direction;


    },

    flipEnemyDir: function(){
        this.enemy.data.direction *= -1;
    },

    attackState: function(){
        this.physics.arcade.moveToObject(this.enemy , player, enemySpeed);
    },


    buildWorld: function() {
        // Load the json file
        var level = this.game.cache.getJSON('testMap3');
        console.log(level);

        this.game.world.setBounds(0, 0, level.tiles[0].length * tileWidth + tileWidth / 2, level.tiles.length * tileHeight / 2);

        //this.buildTiles(level);
        this.buildIsometricTiles(level);
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


    //builds isometric tiles
    buildIsometricTiles: function(level) {
        var integerToTileName = ['grass1', 'grass2', 'grass3', 'grass4', 'grass5'];

        for(var i=0; i<level.tiles.length; i++)
            for(var j=0; j<level.tiles[i].length; j++) {
                var tileName = integerToTileName[level.tiles[i][j]];
                console.log("making a tile: " + tileName + " from index " + level.tiles[i][j] + " i=" + i + " j=" + j);
                var x = tileWidth * j + ((i%2) * tileWidth / 2);
                var y = tileHeight * i / 2;
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

        var integerToActorName = ['resourceRed', 'resourceBlue', 'yellow20'];
        var integerToActorResponse =[this.interactWithResource, this.interactWithResource, this.interactWithResource,this.textInteract];

        var integerToData = [
                function(curActor) {
                    curActor.data.resource = 0;
                    curActor.data.health = 3;
                },
                function(curActor) {
                    curActor.data.resource = 1;
                    curActor.data.health = 4;
                },
                function(curActor) {
                    curActor.data.resource = 2;
                    curActor.data.health = 3;
                },
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


    //builds the emitters for the resources
    buildEmitters: function() {
        for(var i=0; i<resourceEmitters.length; i++) {
            resourceEmitters[i] = this.game.add.emitter(0, 0, 20);
            resourceEmitters[i].makeParticles(resourceParticles[i]);
            resourceEmitters[i].gravity = 200;
            emitters.add(resourceEmitters[i]);
        }
    },


    //create collision around ship and adds it to collision group
    createCollision: function(){
        var leftShipCollision = this.game.add.sprite(ship.body.x,ship.body.y, 'transparent1x250');
        collision.add(leftShipCollision);
        this.game.physics.enable(leftShipCollision, Phaser.Physics.ARCADE);
        leftShipCollision.body.immovable = true;

        var topShipCollision = this.game.add.sprite(ship.body.x,ship.body.y, 'transparent400x1');
        collision.add(topShipCollision);
        this.game.physics.enable(topShipCollision, Phaser.Physics.ARCADE);
        topShipCollision.body.immovable = true;

        var bottomShipCollision = this.game.add.sprite(ship.body.x, ship.body.y+250, 'transparent400x1');
        collision.add(bottomShipCollision);
        this.game.physics.enable(bottomShipCollision, Phaser.Physics.ARCADE);
        bottomShipCollision.body.immovable = true;

    },


    //returns if the player has the resources needed
    hasResources: function(resoursesNeeded){
        if(resources[0] >= resourcesNeeded[0] && resources[1] >= resourcesNeeded[1]){
            return true;
        }
        else{
            return false;
        }

    },


    //increments press counter
    increment: function(){
        this.press = this.press + 1;

    },


    //Prints out text word by word. Creates two strings and compares to see if the text can fit in the bubble
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


    //this function exists to handle text interactions with the player and eve
    textInteract: function(){

        console.log(this.press);

        let dialogue = this.game.cache.getJSON('text'); //reading json


        if(Phaser.Math.isEven(this.press)){ //continues text interaction if odd
            this.bubble.x = this.game.camera.x +10;
            this.bubble.y = this.game.camera.y + 440;
            this.text1.x = this.game.camera.x+30;
            this.text1.y = this.game.camera.y+450;

            this.text1.text = "";
            this.textCompare.text = ""; 

            this.checkDialogue(); //checks which dialogue to print out

            line = dialogue.testText[textIndex][lineIndex].split(' ');


            if(wordIndex < line.length){
                this.game.time.events.add(100, this.increment, this);
                console.log("wordIndex < line.length");

            } //increments if we need more room for text


            if(wordIndex == line.length && lineIndex <  dialogue.testText[textIndex].length-1){
                lineIndex++;
                wordIndex = 0;

                this.game.time.events.add(100,this.increment,this);
                console.log("wordIndex == line.length");
            } //increments if we need more text


                line = dialogue.testText[textIndex][lineIndex].split(' ');



            this.game.time.events.repeat(wordDelay, line.length, this.nextWord, this); //calls nextWord function to print out text by word


            canMove = 0;

            this.game.time.events.add(100, this.increment, this); //increments press counter


        }
        if(Phaser.Math.isOdd(this.press)){ //resets text if odd
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


    //Checks to see if the player has the resources needed to progress the dialogue
    checkDialogue: function(){

        if(this.hasResources(greenNeeded, redNeeded)){ //resets resources and increments story in text.json if they have resources
            if(this.press != 0){
                textIndex = textIndex + 1;
                this.resetResources();

                if(resourceIndex != resourceList.length){
                    resourceIndex++;
                    resourcesNeeded = resourceList[resourceIndex];
                    this.timeInSeconds = timeArray[resourceIndex];
                }
            }

        } //otherwise they get told they do not have enough
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

    //calls the corresponding functin for the player to interact with the actor
    interactWithActor: function(player, actor) {
        actor.data.onInteract.call(this, actor);

    },


    /*
    This calls addDrops with the actors information.
     */
    interactWithResource: function(actor) {

        resourceEmitters[actor.data.resource].x = actor.x;
        resourceEmitters[actor.data.resource].y = actor.y;
        emitters.bringToTop(resourceEmitters[actor.data.resource]);
        resourceEmitters[actor.data.resource].start(true, 500, 0, 15, false);

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

    //adds drops across the map to the drop group
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

    //has the player pick up a drop
    pickUpDrop: function(player, drop) {
        console.log('pickup drop...');
        resources[drop.data.resource]++;
        drop.destroy();
    },

    //Checks for overlap between two sprites
    checkForOverLap: function(spriteA, spriteB){
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    
    // Function to tick down time for the counter + formatting
    tick: function(){
        if(!this.checkForOverLap(player, ship)){ // does not decrement if the player is located inside the ship
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
        if(this.timeInSeconds < timeArray[resourceIndex]){
            this.toAdd = timeArray[resourceIndex]-this.timeInSeconds;
            this.timeInSeconds = this.timeInSeconds + this.toAdd;
        }
        for(var i=0; i < resources.length; i++)
            resources[i] = 0;

    },

    //Returns a random integer 
    randIntBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },


    /*
    Plays a sound with a given name
     */
    playSound: function(soundName) {
        var sound = this.add.audio(soundName);
        sound.play();
    },


    stopPlayer: function(){
        //This function just exists as a call for collision between collidable walls and the player
    }
    
};