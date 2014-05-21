'use strict';
var Duck = require('../prefabs/duck');
var Ground = require('../prefabs/ground');

function Play() {}
Play.prototype = {
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 500;
        this.background = this.game.add.sprite(0, 0, 'background');

        this.duck = new Duck(this.game, 100, this.game.height / 2);
        this.game.add.existing(this.duck);

        this.ground = new Ground(this.game, 0, 400, 335, 112);
        this.game.add.existing(this.ground);
    },
    update: function () {
        this.game.physics.arcade.collide(this.duck, this.ground);
    }
};

module.exports = Play;
