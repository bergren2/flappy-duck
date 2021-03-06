'use strict';

var Scoreboard = function(game) {
    var gameover;

    Phaser.Group.call(this, game);
    gameover = this.create(this.game.width / 2,  100, 'gameover');
    gameover.anchor.setTo(0.5, 0.5);

    this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
    this.scoreboard.anchor.setTo(0.5, 0.5);

    this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
    this.add(this.scoreText);

    this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
    this.add(this.bestScoreText);

    // start button
    this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5, 0.5);
    this.add(this.startButton);

    this.y = this.game.height;
    this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
    var medal, bestScore;

    this.scoreText.setText(score.toString());

    if (!!localStorage) {
        bestScore = localStorage.getItem('bestScore');

        if (!bestScore || bestScore < score) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
    } else {
        bestScore = 'N/A';
    }

    this.bestScoreText.setText(bestScore.toString());

    if (score >= 10 && score < 25) {
        medal = this.game.add.sprite(-65, 7, 'medals', 1);
        medal.anchor.setTo(0.5, 0.5);
        this.scoreboard.addChild(medal);
    } else if (score >= 25) {
        medal = this.game.add.sprite(-65, 7, 'medals', 0);
        medal.anchor.setTo(0.5, 0.5);
        this.scoreboard.addChild(medal);
    }

    if (medal) {
        this.emitter = this.game.add.emitter(medal.x, medal.y, 400);
        this.scoreboard.addChild(this.emitter);
        this.emitter.width = medal.width;
        this.emitter.height = medal.height;

        this.emitter.makeParticles('particle');

        this.emitter.setRotation(-100, 100);
        this.emitter.setXSpeed(0, 0);
        this.emitter.setYSpeed(0, 0);
        this.emitter.minParticleScale = 0.25;
        this.emitter.maxParticleScale = 0.5;
        this.emitter.setAll('body.allowGravity', false);

        this.emitter.start(false, 1000, 1000);
    }

    this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
};

Scoreboard.prototype.startClick = function () {
    this.game.state.start('play');
};

module.exports = Scoreboard;
