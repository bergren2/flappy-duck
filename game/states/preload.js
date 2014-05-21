'use strict';
function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function () {
        this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);

        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('title', 'assets/title.png');
        this.load.image('startButton', 'assets/start-button.png');
        this.load.image('instructions', 'assets/instructions.png');
        this.load.image('getReady', 'assets/get-ready.png');

        this.load.spritesheet('duck', 'assets/duck.png', 34, 24, 3);
        this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2);

        var fontDirectory = 'assets/fonts/flappyfont';
        this.load.bitmapFont('flappyfont', fontDirectory + '/flappyfont.png', fontDirectory + '/flappyfont.fnt');
    },
    create: function () {
        this.asset.cropEnabled = false;
    },
    update: function () {
        if(!!this.ready) {
            this.game.state.start('menu');
        }
    },
    onLoadComplete: function () {
        this.ready = true;
    }
};

module.exports = Preload;
