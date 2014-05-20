'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {
  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
    this.ground.autoScroll(-200, 0);
  },
  update: function() {
  }
};

module.exports = Menu;
