XPlorer.Menu = function() {};

XPlorer.Menu.prototype = {

    preload: function() {

    },


    create: function() {
    	this.background = this.game.add.sprite(0,0,'menuBack');

    	this.logoText = this.game.add.sprite(this.game.world.centerX-225, 100, 'logo');

    	var btn = this.game.add.button(this.game.world.centerX-275, 350, "startBtn", this.startGame, this);

    	




    },

    startGame: function(){
    	this.state.start("Game");
    },


};