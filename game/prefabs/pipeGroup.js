'use strict';
var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.topPipe = new Pipe(this.game, 0, 0, 0);
    this.add(this.topPipe);

    // 440 is a magic number
    this.bottomPipe = new Pipe(this.game, 0, 440, 1);
    this.add(this.bottomPipe);

    this.setAll('body.velocity.x', -200);
    this.hasScored = false;
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

module.exports = PipeGroup;
