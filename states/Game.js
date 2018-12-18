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
    enemySpeed = 130,
    enemyRange = 142,
    resources = [0,0,0,0], // [Green, Red]
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
    textIndex = 2,
    taskNum = 0,
    greenNeeded = 10,
    redNeeded = 5,
    inc = true,
    collision,
    lines,
    tilesRendered,
    tilesArray,
    timeArray = [],
    resourceList = [],
    resourcesNeeded = [],
    resourceIndex = 0,
    inc = true,
    line = [],
    numberOfRocks = 30,
    timerBar,
    timerCover,
    sidebar,
    maxTime,
    rocks,
    playerStartX,
    playerStartY,
    thisdotgame,
    timeInSeconds,
    curtain,
    shipOutside,
    blackInsideShip,
    ambiance;



XPlorer.Game.prototype = {

    create: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        thisdotgame = this.game;

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

        rocks = this.game.add.group();
        rocks.enableBody = true;
        rocks.physicsBodyType = Phaser.Physics.ARCADE;

        emitters = this.game.add.group();

        collision = this.game.add.group();
        collision.enableBody = true;
        collision.physicsBodyType = Phaser.Physics.ARCADE;

        lines = this.game.add.group();
        //lines.enableBody = true;
        //lines.physicsBodyType = Phaser.Physics.ARCADE;

        enemies = this.game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.buildWorld();

        player = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'mo');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        playerStartX = player.x;
        playerStartY = player.y;

        ship = this.game.add.sprite(player.body.x - 230, player.body.y - 230, 'ship');
        ship.enableBody = true;
        this.game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.setSize(380, 200, 0, 120);
        ship.body.immovable = true;
        actors.add(ship);

        backInsideShip = this.game.add.sprite(ship.body.x-205, ship.body.y-107, 'blackInsideShip')

        shipOutside = this.game.add.sprite(ship.body.x-205, ship.body.y-107, 'shipOutside');
        shipOutside.alpha = 0.35;

        ship.data.onInteract = this.textInteract;

        enemies = this.game.add.group();
        enemies.enableBody = true;


        //adds player animations
        this.addAnimations();

        //adds enemies and animations for each one
        this.addEnemies(); 

        enemies.forEach(function(item){
            item.animations.add('hover',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 24, true);
            item.animations.play('hover');
        },this);


        //changes anchor to the middle of the player
        player.anchor.setTo(0.5,0.5);
        player.body.setSize(30, 30, 15, 34);

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
        this.text1 = this.game.add.text(this.game.camera.x+150, this.game.camera.y+450, '', { fontSize: '30px', fill: '#000000', wordWrap: true, wordWrapWidth: 790});
        this.text1.lineSpacing = -10;

        this.textCompare = this.game.add.text(this.game.width + 1000, this.game.height + 1000, '', { fontSize: '30px', fill: '#000000', wordWrap: true, wordWrapWidth: 790});
        this.textCompare.lineSpacing = -10;
        
        // Setting up timer for oxygen
        timeArray = this.game.cache.getJSON('text').oxygenTime[0];
        timeInSeconds = timeArray[resourceIndex];
        this.timeText = this.game.add.text(this.game.camera.x - 100, this.game.camera.y, "0:00", { fontSize: '30px', fill: '#ffffff' });
        this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this); // timer event calls tick function for seconds 
        timeInSeconds = 5; //DEBUG CODE ONLY
        maxTime = 35;

        //this.game.world.bringToTop(actors);

        this.buildEmitters();
        resourceList = this.game.cache.getJSON('text').resourceCount;
        resourcesNeeded = resourceList[resourceIndex];

        this.timer2 = this.game.time.events.loop(1250, this.flipEnemyDir, this); //adds timer for enemies to flip around
        timerBar = this.game.add.sprite(32, 80+184, "timerBar");
        timerBar.anchor.set(0, 1);
        timerCover = this.game.add.sprite(0, 30, "timerCover");
        sidebar = this.game.add.sprite(width-85, 50, "sidebar");
        timerBar.fixedToCamera = true;
        timerCover.fixedToCamera = true;
        sidebar.fixedToCamera = true;
        ambiance = this.add.audio('ambiance');
        ambiance.loop = true;
        ambiance.play();

        this.phaserTimer = this.game.time.create(false); //adds timer for re adding enemies
        this.phaserTimer.start();

        this.redCounter = this.game.add.sprite(width-80, 70, 'resourceRed');
        this.redCounter.fixedToCamera = true;

        this.blueCounter = this.game.add.sprite(width-80, 116, 'resourceBlue');
        this.blueCounter.fixedToCamera = true;

        this.orangeCounter = this.game.add.sprite(width-80, 162, 'resourceOrange');
        this.orangeCounter.scale.setTo(.75,.75);
        this.orangeCounter.fixedToCamera = true;

        this.pinkCounter = this.game.add.sprite(width-80, 210, 'resourcePink');
        this.pinkCounter.scale.setTo(.428,.428);
        this.pinkCounter.fixedToCamera = true;

        this.game.world.bringToTop(this.bubble);
        this.game.world.bringToTop(this.text1);

        //adds collision for spaceShip
        this.createCollision();

        this.redText = this.game.add.text(width-50, 85,'x ' + resources[0], { fontSize: '12px', fill: '#ffffff' });
        this.redText.fixedToCamera = true;

        this.blueText = this.game.add.text(width-50, 130,'x ' + resources[1], { fontSize: '12px', fill: '#ffffff' });
        this.blueText.fixedToCamera = true;

        this.orangeText = this.game.add.text(width-50, 175,'x ' + resources[2], { fontSize: '12px', fill: '#ffffff' });
        this.orangeText.fixedToCamera = true;

        this.pinkText = this.game.add.text(width-50, 220,'x ' + resources[3], { fontSize: '12px', fill: '#ffffff' });
        this.pinkText.fixedToCamera = true;


        curtain = this.game.add.sprite(0, 0, 'curtain');
        curtain.alpha = 0;
        curtain.fixedToCamera = true;




    },


    update: function() {
        this.handleInput();

        console.log("x: " + player.body.x);
        console.log("y: " + player.body.y);

        this.blueText.text = "x " + resources[1];
        this.redText.text = "x " + resources[0];
        this.orangeText.text = "x " + resources[2];
        this.pinkText.text = "x " +resources[3];

        this.physics.arcade.overlap(drops, player, this.pickUpDrop, null, this);
        this.physics.arcade.collide(player, collision, this.stopPlayer,null, this);

        enemies.forEach(function(enemy){
            var distance = this.physics.arcade.distanceBetween(enemy, player);
            if(enemy.data.hasCollided == false){
                if(distance <= enemyRange){
                    this.attackState(enemy);
                }
                else{
                    this.paceState(enemy);
                }
            }
            else if(enemy.data.hasCollided == true){
                this.takeResourcesState(enemy);
            }
            
        },this);

        this.physics.arcade.collide(enemies, ship,this.stopPlayer,null, this);

        if(this.checkForOverLap(player,ship)){
            shipOutside.alpha = 0.35;
        }
        else{
            shipOutside.alpha = 1;
        }

        if(this.bubble.x == -10000){
            this.text1.text = "";
            wordIndex = 0;
        }

        if(Phaser.Line.intersectsRectangle(this.line1,player)){
            
        }

    },


    render: function() {
        this.game.debug.geom(this.line1);
        this.game.debug.text(this.timeText.text, 50, 100);
        // this.game.debug.body(player);
        // this.game.debug.body(ship);
    },


    //handles player input and decides which way the player will go/face
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

        ship.animations.add('play', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35], 10,true);
        ship.animations.play('play');
    },

    //adds enemies to the level
    addEnemies: function(){
        this.enemy1 = this.game.add.sprite(ship.body.x - 350, ship.body.y, 'enemy');
        enemies.add(this.enemy1);
        this.enemy1.data.direction = -1;    //which direction the enemy is moving
        this.enemy1.data.whichWay = this.game.rnd.integerInRange(0, 1); //determine if it moves side to side or up and down
        this.enemy1.data.hasCollided = false;   //tells if it has collided with player
        this.enemy1.data.decrement = true;  //tells if it should decrement resources from player
        this.enemy1.data.return = false; //tells if it should return to its original position
        this.enemy1.data.hp = 4; // hit points of the enemy

        this.enemy1.data.defaultX = ship.body.x - 350;
        this.enemy1.data.defaultY = ship.body.y;

        this.enemy2 = this.game.add.sprite(ship.body.x + 200, ship.body.y + 600, 'enemy');
        enemies.add(this.enemy2);
        this.enemy2.data.direction = -1;
        this.enemy2.data.whichWay = this.game.rnd.integerInRange(0, 1);
        this.enemy2.data.hasCollided = false;
        this.enemy2.data.decrement = true;
        this.enemy2.data.return = false;
        this.enemy2.data.hp = 2;

        this.enemy2.data.defaultX = ship.body.x + 200;
        this.enemy2.data.defaultY = ship.body.y + 600;

        this.enemy3 = this.game.add.sprite(ship.body.x, ship.body.y-300, 'enemy');
        enemies.add(this.enemy3);
        this.enemy3.data.direction = -1;
        this.enemy3.data.whichWay = this.game.rnd.integerInRange(0, 1);
        this.enemy3.data.hasCollided = false;
        this.enemy3.data.decrement = true;
        this.enemy3.data.return = false;
        this.enemy3.data.hp = 2;

        this.enemy3.data.defaultX = ship.body.x;
        this.enemy3.data.defaultY = ship.body.y - 300;

        this.enemy4 = this.game.add.sprite(ship.body.x + 700, ship.body.y + 250, 'enemy');
        enemies.add(this.enemy4);
        this.enemy4.data.direction = -1;
        this.enemy4.data.whichWay = this.game.rnd.integerInRange(0, 1);
        this.enemy4.data.hasCollided = false;
        this.enemy4.data.decrement = true;
        this.enemy4.data.return = false;
        this.enemy4.data.hp = 2;

        this.enemy4.data.defaultX = ship.body.x + 700;
        this.enemy4.data.defaultY = ship.body.y + 250;

        this.enemy5 = this.game.add.sprite(ship.body.x - 300 , ship.body.y + 800 , 'enemy');
        enemies.add(this.enemy5);
        this.enemy5.data.direction = -1;
        this.enemy5.data.whichWay = 0;
        this.enemy5.data.hasCollided = false;
        this.enemy5.data.decrement = true;
        this.enemy5.data.return = false;
        this.enemy1.data.hp = 2;

        this.enemy5.data.defaultX = ship.body.x - 300;
        this.enemy5.data.defaultY = ship.body.y + 800;

        this.enemy6 = this.game.add.sprite(ship.body.x + 720 , ship.body.y - 525 , 'enemy');
        enemies.add(this.enemy6);
        this.enemy6.data.direction = -1;
        this.enemy6.data.whichWay = 0;
        this.enemy6.data.hasCollided = false;
        this.enemy6.data.decrement = true;
        this.enemy6.data.return = false;
        this.enemy1.data.hp = 2;

        this.enemy6.data.defaultX = ship.body.x + 720;
        this.enemy6.data.defaultY = ship.body.y -525;
        
    },
    spawnGenericEnemy: function(x,y){
        console.log("Adding generic enemy");
        this.enemy = this.game.add.sprite(x,y, 'enemy');
        enemies.add(this.enemy);
        this.enemy.data.direction = -1;
        this.enemy.data.whichWay = this.game.rnd.integerInRange(0, 1);
        this.enemy.data.hasCollided = false;
        this.enemy.data.decrement = true;
        this.enemy.data.return = false;
        this.enemy.data.hp = 2;

        this.enemy.data.defaultX = x;
        this.enemy.data.defaultY = y;

        this.enemy.animations.add('hover',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 24, true);
        this.enemy.animations.play('hover');
    },

    //Base state for enemies
    paceState: function(enemy){
        if(enemy.data.whichWay == 1){
            enemy.body.velocity.x = 0
            enemy.body.velocity.y = enemySpeed * enemy.data.direction;
        }
        else if(enemy.data.whichWay == 0){
            enemy.body.velocity.x = enemySpeed * enemy.data.direction;
            enemy.body.velocity.y = 0;
        }
        enemy.data.decrement = true;
        enemy.data.return = false;


    },
    //flips the way the enemies move
    flipEnemyDir: function(){
        enemies.forEach(function(item){
            item.data.direction *= -1;
        },this);
    },

    //Hostile State for Enemies
    attackState: function(enemy){
        this.physics.arcade.moveToObject(enemy , player, enemySpeed);
        if(this.checkForOverLap(enemy,player)){
            enemy.data.hasCollided = true;
        }
    },
    //decrements resources by 2 and has alien run away
    takeResourcesState: function(enemy){
        if(enemy.data.decrement == true){
            canMove = 0;
            this.game.time.events.add(500, this.switchCanMove, this);
        }
        if(resources[0] > 1 && resources[1] > 1 &&  enemy.data.decrement == true){
            resources[0] = resources[0] - 2;
            resources[1] = resources[1] - 2;
            enemy.data.decrement = false;
        }
        else if (resources[0] <= 1 && resources[1] <= 1 && enemy.data.decrement == true){
            resources[0] = 0;
            resources[1] = 0;
            enemy.data.decrement = false;
        }
        else if(resources[0] <= 1 && resources[1] > 1 && enemy.data.decrement == true){
            resources[0] = 0;
            resources[1] = resources[1] - 2;
            enemy.data.decrement = false;
        }
        else if(resources[0] > 1 && resources[1] <= 1 && enemy.data.decrement == true){
            resources[0] = resources[0] - 2;
            resources[1] = 0;
            enemy.data.decrement = false;
        }

        if(enemy.body.x > 1550){
            enemy.data.return = true;
        }

        enemy.body.velocity.x = 175;
        if(enemy.data.return == true){

            this.originalPos = this.game.add.sprite(enemy.data.defaultX,enemy.data.defaultY, 'transparent');

            this.physics.arcade.moveToObject(enemy , this.originalPos, enemySpeed);

            if(this.physics.arcade.distanceBetween(enemy, this.originalPos) < 5){
                enemy.data.hasCollided = false;
                this.paceState(enemy);
            }

        }
    },

    switchCanMove: function(){
        if(canMove == 0){
            canMove = 1;
        }
        else{
            canMove = 0;
        }
    },



    buildWorld: function() {
        // Load the json file
        var level = this.game.cache.getJSON('finalMap');
        console.log(level);

        this.game.world.setBounds(0, 0, level.tiles[0].length * tileWidth + tileWidth / 2, level.tiles.length * tileHeight / 2);

        //this.buildTiles(level);
        this.buildIsometricTiles(level);
        this.buildActors(level);
        this.buildRocks();

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
                //console.log("making a tile: " + tileName + " from index " + level.tiles[i][j] + " i=" + i + " j=" + j);
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

        var integerToActorName = ['resourceRed', 'resourceBlue', 'resourceOrange', 'resourcePink'];
        var integerToActorResponse =[this.interactWithResource, this.interactWithResource, this.interactWithResource, this.interactWithResource];

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
                function(curActor) { 
                    curActor.data.resource = 3;
                    curActor.data.health = 7;
                }
            ];

        for(var i=0; i<level.actors.length; i++) {
            var actorName = integerToActorName[level.actors[i].name];
            var x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            var curActor = this.game.add.sprite(x, y, actorName);
            curActor.animations.add('sparkle',[0,1,2,3,4,5,6], 10, true);
            curActor.animations.play('sparkle');
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


    // Make the rocks that surround the edge of the map
    buildRocks: function() {
        var rockNames = ['rock1', 'rock2', 'rock3', 'rock4', 'rock5'];
        for(var i=0; i<numberOfRocks; i++) {
            var rand = Math.floor(Math.random() * 5);
            var newRockleft = this.game.add.sprite(
                0,
                this.game.world.height/numberOfRocks * i,
                rockNames[rand]);
            var newRockRight = this.game.add.sprite(
                this.game.world.width,
                this.game.world.height/numberOfRocks * i,
                rockNames[rand]);
            collision.add(newRockleft);
            collision.add(newRockRight);
            newRockleft.body.immovable = true;
            newRockRight.body.immovable = true;
            this.game.physics.enable(newRockleft, Phaser.Physics.ARCADE);
            this.game.physics.enable(newRockRight, Phaser.Physics.ARCADE);
        }
        for(i=0; i<numberOfRocks; i++) {
            rand = Math.floor(Math.random() * 5);
            newRockleft = this.game.add.sprite(
                this.game.world.width/numberOfRocks * i,
                0,
                rockNames[rand]);
            newRockRight = this.game.add.sprite(
                this.game.world.width/numberOfRocks * i,
                this.game.world.height,
                rockNames[rand]);
            collision.add(newRockleft);
            collision.add(newRockRight);
            newRockleft.body.immovable = true;
            newRockRight.body.immovable = true;
            this.game.physics.enable(newRockleft, Phaser.Physics.ARCADE);
            this.game.physics.enable(newRockRight, Phaser.Physics.ARCADE);

        }


    },


    //create collision around ship and adds it to collision group
    createCollision: function(){
        this.line1 = new Phaser.Line(690,688,895,790);
        this.line2 = new Phaser.Line();
        
    },


    //returns if the player has the resources needed
    hasResources: function(resoursesNeeded){
        if(resources[0] >= resourcesNeeded[0] && resources[1] >= resourcesNeeded[1] && resources[2] >= resourcesNeeded[2] && resources[3] >= resourcesNeeded[3]){
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

        if(wordIndex < line.length &&  this.textCompare.height < this.bubble.height-20){

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
            this.text1.x = this.game.camera.x+150;
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

        if(this.hasResources(resources)){ //resets resources and increments story in text.json if they have resources
            if(this.press != 0){
                textIndex = textIndex + 1;
                this.resetResources();

                if(resourceIndex != resourceList.length){
                    resourceIndex++;
                    resourcesNeeded = resourceList[resourceIndex];
                    timeInSeconds = timeArray[resourceIndex];
                    maxTime = timeArray[resourceIndex];
                }
            }

        } //otherwise they get told they do not have enough
        else{
            if(this.press != 0 && wordIndex == 0 && lineIndex == 0){
                textIndex = 0;
            }
            if(player.body.x == playerStartX && player.body.y == playerStartY){
                textIndex = 1;
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
        enemies.forEach(function(item){
            this.physics.arcade.overlap(hitbox, item, this.interactWithEnemy, null, this)
        },this);
        //hitbox.destroy();
    },

    //calls the corresponding functin for the player to interact with the actor
    interactWithActor: function(player, actor) {
        actor.data.onInteract.call(this, actor);

    },

    // Hit the enemy. If the enemies health is 1, kill it.
    interactWithEnemy:function(player, enemy){
        this.playSound('hit');
        if(enemy.data.hp > 1){
            enemy.data.hp--;
        }
        else{
            this.playSound('enemyDestroyed');
            this.spawnX = enemy.data.defaultX;
            this.spawnY = enemy.data.defaultY;

            this.numOfDrops = this.game.rnd.integerInRange(1, 4);
            this.dropType =  this.game.rnd.integerInRange(0, 1);
            this.addDrops(enemy.body.x, enemy.body.y,this.dropType,this.numOfDrops);

            enemy.destroy();

            console.log(this.phaserTimer.running);
            this.phaserTimer.add(this.phaserTimer.ms + 7000, this.spawnGenericEnemy, this, this.spawnX, this.spawnY);
        }
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
            drop.animations.add('glow', [0,1,2,3,4,5,6,7,8,9,10], 10, true)
            drop.animations.play('glow');
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
            timeInSeconds--;
        }

        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = timeInSeconds - (minutes * 60);
        var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
        this.timeText.text = timeString;

        if (timeInSeconds == 0) { // This condition calls functions when timer hits 0
            this.playerRunsOutOfOxygen()
        }
        this.updateOxygenBar();
    },


    /*
    Caled when the player runs out of oxygen.
        tween a black sprite over the screen,
        then reset the player to the center of the map,
        take away half of their resources
     */
    playerRunsOutOfOxygen: function() {
        canMove = 0;
        tween = thisdotgame.add.tween(curtain).to({alpha: 1}, 1000, "Linear", true);
        tween.onComplete.add(function() {
            player.x = playerStartX;
            player.y = playerStartY;
            newTween = thisdotgame.add.tween(curtain).to({alpha: 0}, 1000, "Linear", true);
            newTween.onComplete.add(function() {
                canMove = 1;
                timeInSeconds = maxTime;

            })
        })


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
        if(timeInSeconds < timeArray[resourceIndex]){
            this.toAdd = timeArray[resourceIndex]-timeInSeconds;
            timeInSeconds = timeInSeconds + this.toAdd;
        }
        for(var i=0; i < resources.length; i++)
            resources[i] = resources[i] - resourcesNeeded[i];

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
    },


    updateOxygenBar: function() {
        timerBar.scale.setTo(1, timeInSeconds/maxTime)
    }
    
};