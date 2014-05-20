'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {
  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    this.ground.autoScroll(-200, 0);

    this.titleGroup = this.game.add.group();

    this.title = this.game.add.sprite(0, 0, 'title');
    this.titleGroup.add(this.title);

    this.duck = this.game.add.sprite(200, 5, 'duck');
    this.titleGroup.add(this.duck);

    this.duck.animations.add('flap');
    this.duck.animations.play('flap', 12, true);

    this.titleGroup.x = 30;
    this.titleGroup.y = 0;

    this.game.add.tween(this.titleGroup).to(
        {y: 15}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true
    );
  },
  update: function() {
  }
};

module.exports = Menu;
