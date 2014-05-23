'use strict';
var Duck       = require('../prefabs/duck');
var Ground     = require('../prefabs/ground');
var PipeGroup  = require('../prefabs/pipeGroup');
var Scoreboard = require('../prefabs/scoreboard');

function Play() {}
Play.prototype = {
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1200;
        this.background = this.game.add.sprite(0, 0, 'background');
        this.score = 0;

        // prefabs
        this.pipes = this.game.add.group();

        this.duck = new Duck(this.game, 100, this.game.height / 2);
        this.game.add.existing(this.duck);


        this.ground = new Ground(this.game, 0, 400, 335, 112);
        this.game.add.existing(this.ground);

        // mouse / touch controls
        this.game.input.onDown.addOnce(this.startGame, this);
        this.game.input.onDown.add(this.duck.flap, this.duck);

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
        if (this.duck.alive) {
            this.game.physics.arcade.collide(this.duck, this.ground, this.deathHandler, null, this);
            this.pipes.forEach(function (pipeGroup) {
                this.checkScore(pipeGroup);
                this.game.physics.arcade.collide(this.duck, pipeGroup, this.deathHandler, null, this);
            }, this);
        } else {
            this.game.physics.arcade.collide(this.duck, this.ground, null, null, this);
        }

        // medal sparkles
        if (this.scoreboard && this.scoreboard.emitter) {
            this.scoreboard.emitter.forEachAlive(function (particle) {
                var life = particle.lifespan;
                var span = this.scoreboard.emitter.lifespan;
                particle.alpha = (span - Math.abs(life - span / 2)) / this.scoreboard.emitter.lifespan;
            }, this);
        }
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
        this.duck.alive = false;
        this.pipes.callAll('stop');
        this.pipeGenerator.timer.stop();
        this.ground.stopScroll();
        this.scoreboard = new Scoreboard(this.game);
        this.game.add.existing(this.scoreboard);
        this.scoreboard.show(this.score);
    },

    shutdown: function () {
        this.duck.destroy();
        this.pipes.destroy();
        this.scoreboard.destroy();
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
