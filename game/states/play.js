'use strict';
var Duck      = require('../prefabs/duck');
var Ground    = require('../prefabs/ground');
var PipeGroup = require('../prefabs/pipeGroup');

function Play() {}
Play.prototype = {
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;
        this.background = this.game.add.sprite(0, 0, 'background');

        this.duck = new Duck(this.game, 100, this.game.height / 2);
        this.game.add.existing(this.duck);

        this.pipes = this.game.add.group();

        this.ground = new Ground(this.game, 0, 400, 335, 112);
        this.game.add.existing(this.ground);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        flapKey.onDown.add(this.duck.flap, this.duck);
        this.input.onDown.add(this.duck.flap, this.duck);

        this.pipeGenerator = this.game.time.events.loop(
            Phaser.Timer.SECOND * 1.25, this.generatePipes, this
        );
        this.pipeGenerator.timer.start();
    },

    update: function () {
        this.game.physics.arcade.collide(
            this.duck, this.ground, this.deathHandler, null, this
        );
        this.pipes.forEach(function (pipeGroup) {
            this.game.physics.arcade.collide(
                this.duck, pipeGroup, this.deathHandler, null, this
            )
        }, this);
    },

    generatePipes: function () {
        var pipeY = this.game.rnd.integerInRange(-100, 100);
        var pipeGroup = this.pipes.getFirstExists(false);

        if (!pipeGroup) {
            pipeGroup = new PipeGroup(this.game, this.pipes);
        }

        pipeGroup.reset(this.game.width, pipeY);
    },

    deathHandler: function () {
        this.game.state.start('gameover');
    },

    shutdown: function () {
        this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
        this.duck.destroy();
        this.pipes.destroy();
    }
};

module.exports = Play;
