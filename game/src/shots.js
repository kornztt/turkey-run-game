// Gobble Dash — deterministic screenshot scenes (?shot=title|play|hide|kitchen|caught|escaped).
// Real game states, staged by the game's own code so a screenshot is reproducible.
(function (global) {
  'use strict';
  var CFG = global.GD_CONFIG;

  function applyShot(game, name) {
    var run = game.run;
    if (name === 'play') {
      game.state = 'play';
      run.distanceM = 240;
      run.score = 2840;
      run.lives = 3;
      run.farmerGap = 190;
      run.speed = 7.2;
      run.nextSpawnM = 99999;
      run.entities = [
        { kind: 'fence', x: 780, w: 110, passed: false },
        { kind: 'corn', x: 560, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'corn', x: 630, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'corn', x: 700, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'knife', x: 980, y: 60, vy: 0, state: 'falling', telegraph: 390, passed: false },
        { kind: 'haybale', x: 1120, passed: false }
      ];
      run.turkeyVy = -4;
      run.onGround = false;
      run.turkeyY = CFG.GROUND_Y - 150;
    } else if (name === 'hide') {
      // turkey hidden in a haystack while the farmer searches nearby
      game.state = 'play';
      run.distanceM = 240;
      run.score = 2840;
      run.lives = 3;
      run.farmerGap = 160;
      run.farmerState = 'search';
      run.farmerTimer = 90000;
      run.speed = 3;
      run.timeMs = 0;
      run.hiddenUntil = 100000;
      run.nextSpawnM = 99999;
      run.entities = [
        { kind: 'haystack', x: 340, passed: false },
        { kind: 'corn', x: 700, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'corn', x: 770, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'fence', x: 980, w: 110, passed: false }
      ];
      run.turkeyY = CFG.GROUND_Y;
      run.onGround = true;
    } else if (name === 'kitchen') {
      game.state = 'play';
      run.distanceM = 780;
      run.score = 7420;
      run.lives = 2;
      run.stage = 2;
      run.farmerGap = 190;
      run.speed = 8.4;
      run.nextSpawnM = 99999;
      run.entities = [
        { kind: 'oven', x: 900, passed: false },
        { kind: 'knife', x: 800, y: 60, vy: 0, state: 'falling', telegraph: 390, passed: false },
        { kind: 'pin', x: 1150, y: CFG.GROUND_Y - 14, rot: 0.4, passed: false },
        { kind: 'corn', x: 520, y: CFG.GROUND_Y - 120, got: false },
        { kind: 'corn', x: 590, y: CFG.GROUND_Y - 120, got: false }
      ];
      run.turkeyY = CFG.GROUND_Y;
      run.onGround = true;
    } else if (name === 'caught') {
      game.state = 'end';
      game.endKind = 'caught';
      run.score = 5180;
      run.distanceM = 512;
      run.bestScore = 5180;
    } else if (name === 'escaped') {
      game.state = 'end';
      game.endKind = 'escaped';
      run.score = 12450;
      run.distanceM = 1200;
      run.bestScore = 12450;
    } else {
      game.state = 'title';
    }
    return true;
  }

  function shotFromUrl() {
    var m = /[?&]shot=([a-z]+)/.exec(global.location.search || '');
    return m ? m[1] : null;
  }

  global.GD_SHOTS = { applyShot: applyShot, shotFromUrl: shotFromUrl };
})(this);
