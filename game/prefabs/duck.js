'use strict';

var Duck = function (game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'duck', frame);

    this.anchor.setTo(0.5, 0.5);

    this.animations.add('flap');
    this.animations.play('flap', 12, true);

    this.alive = false;

    this.game.physics.arcade.enableBody(this);
    this.body.allowGravity = false;

    this.flapSound = this.game.add.audio('flap');
};

Duck.prototype = Object.create(Phaser.Sprite.prototype);
Duck.prototype.constructor = Duck;

Duck.prototype.update = function () {
    if (this.angle < 90 && this.alive) {
        this.angle += 2.5;
    }
};

Duck.prototype.flap = function () {
    this.flapSound.play();
    this.body.velocity.y = -400;
    this.game.add.tween(this).to({
        angle: -40
    }, 100).start();
};

module.exports = Duck;
