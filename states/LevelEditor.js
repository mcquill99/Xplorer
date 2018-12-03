XPlorer.LevelEditor = function() {};

var tiles,
    actors,
    integerToTileName = ['black50', 'darkGrey50', 'lightGrey50', 'white50'],
    integerToActorName = ['green20', 'red20', 'yellow20'],
    tileSprite,
    tileWidth = 50,
    tileHeight = 50;

XPlorer.LevelEditor.prototype = {

    create: function() {
        /*
        tiles = [
            [0, 1, 2, 3],
            [1, 2, 3, 0],
            [2, 3, 0, 1],
            [3, 0, 1, 2]
        ];

        actors = [
            {
                "name": 0,
                "position": [0, 0]
            }
        ];


        this.saveMap();
        */

        tiles = this.game.add.group();
        actors = this.game.add.group();

        //tileSprite = this.game.add.tileSprite(0, 0, 960, 600, 'checkerboard50');

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

        // add the tiles into the world
        for(let i=0; i<level.tiles.length; i++) {
            for(let j=0; j<level.tiles[i].length; j++) {
                let tileName = integerToTileName[level.tiles[i][j]];
                let x = tileWidth * j,
                    y = tileWidth * i;
                let curTile = this.game.add.sprite(x, y, tileName);
                tiles.add(curTile);
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

        for(let i=0; i<level.actors.length; i++) {
            let actorName = integerToActorName[level.actors[i].name];
            let x = level.actors[i].position[0],
                y = level.actors[i].position[1];
            let curActor = this.game.add.sprite(x, y, actorName);
            actors.add(curActor);
        }
    },


    saveMap: function() {
        let levelJSON = {};
        levelJSON.tiles = tiles;
        levelJSON.actors = actors;
        console.log(levelJSON);
        let levelText = JSON.stringify(levelJSON);
        console.log(levelText);
    }

};