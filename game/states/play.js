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
        this.score = 0;

        // prefabs
        this.duck = new Duck(this.game, 100, this.game.height / 2);
        this.game.add.existing(this.duck);

        this.pipes = this.game.add.group();

        this.ground = new Ground(this.game, 0, 400, 335, 112);
        this.game.add.existing(this.ground);

        // keyboard controls
        this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.flapKey.onDown.addOnce(this.startGame, this);
        this.flapKey.onDown.add(this.duck.flap, this.duck);

        // mouse / touch controls
        this.game.input.onDown.addOnce(this.startGame, this);
        this.game.input.onDown.add(this.duck.flap, this.duck);

        // prevent propogation
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        // instructions
        this.instructionGroup = this.game.add.group();
        this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
        this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
        this.instructionGroup.setAll('anchor.x', 0.5);
        this.instructionGroup.setAll('anchor.y', 0.5);

        // score
        this.scoreText = this.game.add.bitmapText(this.game.width / 2, 10, 'flappyfont', this.score.toString(), 24);
        this.scoreText.visible = false;

        // sound
        this.scoreSound = this.game.add.audio('score');
    },

    update: function () {
        this.game.physics.arcade.collide(this.duck, this.ground, this.deathHandler, null, this);
        this.pipes.forEach(function (pipeGroup) {
            this.checkScore(pipeGroup);
            this.game.physics.arcade.collide(this.duck, pipeGroup, this.deathHandler, null, this);
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
    },

    startGame: function () {
        this.duck.body.allowGravity = true;
        this.duck.alive = true;
        this.scoreText.visible = true;

        this.instructionGroup.destroy();

        // makin' pipes
        this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
        this.pipeGenerator.timer.start();
    },

    checkScore: function (pipeGroup) {
        if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.duck.world.x) {
            pipeGroup.hasScored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
            this.scoreSound.play();
        }
    }
};

module.exports = Play;
