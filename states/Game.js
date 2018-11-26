XPlorer.Game = function() {
    // If there are any game tuning variables (like player speed, enemy health, ect.) put them here

};

// Initiate variables here
var tileWidth = 50,
    tileHeight = 50,
    tiles,
    actors;


XPlorer.Game.prototype = {

    preload: function() {

    },


    create: function() {
        // Create a tile group. This will hold all tiles and help with chunking later
        tiles = this.game.add.group();
        actors = this.game.add.group();

    },


    update: function() {

    },

    buildWorld: function() {
        // Load the json file
        let level = this.game.cache.getJSON('testMap');

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
                let tileName = integerToTilename[level.tiles[i][j]];
                let x = tileWidth * j,
                    y = tileWidth * i;
                let curTile = this.game.add.sprite(x, y, tileName);
                tiles.add(curTile);
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
            curActor.body.immovable = true;
        }
    }
    
};