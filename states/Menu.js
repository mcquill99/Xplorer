XPlorer.Menu = function() {};

XPlorer.Menu.prototype = {

    preload: function() {

    },


    create: function() {
    	this.background = game.add.sprite(0,0,'menuBack');

    	this.logoText = game.add.sprite(game.world.centerX, 100, 'logo');

    	var btn = game.add.button(game.world.centerX, 370, "startBtn", this.startGame, this);

    	




    },

    startGame: function(){
    	this.state.start("Game");
    },


};