'use strict';

var Duck = function (game, x, y, frame) {
    Phaser.Sprite.call(this, game, x, y, 'duck', frame);

    this.anchor.setTo(0.5, 0.5);

    this.animations.add('flap');
    this.animations.play('flap', 12, true);

    this.game.physics.arcade.enableBody(this);
};

Duck.prototype = Object.create(Phaser.Sprite.prototype);
Duck.prototype.constructor = Duck;

Duck.prototype.update = function () {
    // write your prefab's specific update code here
};

module.exports = Duck;
