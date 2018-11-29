XPlorer.LevelEditor = function() {};

var tiles = [],
    actors = [],
    integerToTileName = ['black50', 'darkGrey50', 'lightGrey50', 'white50'],
    integerToActorName = ['green20', 'red20', 'yellow20'],
    tileSprite;

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

        tileSprite = this.game.add.tileSprite(0, 0, 960, 600, 'checkerboard50');

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