XPlorer.Menu = function() {};

var menuMusic,
    btn;

XPlorer.Menu.prototype = {

    preload: function() {

    },


    create: function() {
    	this.background = this.game.add.sprite(0,0,'menuBack');

    	this.logoText = this.game.add.sprite(this.game.world.centerX-225, 100, 'logo');

    	btn = this.game.add.button(this.game.world.centerX-275, 350, "startBtn", this.startGame, this);

        menuMusic = this.add.audio('menuMusic'); // Flight by Nctrnm
        menuMusic.loop = true;
        menuMusic.play();




    },

    startGame: function(){
        menuMusic.stop();
    	this.state.start("Game");
    },


};