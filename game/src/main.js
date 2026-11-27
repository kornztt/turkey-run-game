// Gobble Dash — game loop and screens: title, play, paused, caught, escaped.
(function (global) {
  'use strict';
  var CFG = global.GD_CONFIG;
  var canvas = global.document.getElementById('game');
  var ctx = canvas.getContext('2d');

  var game = {
    state: 'title', // title | play | paused | end
    endKind: 'caught',
    run: global.GD_WORLD.newRun(),
    bestScore: 0,
    t: 0,
    lastTs: 0
  };

  // read-only handle for play-testing from the browser console
  global.GD_GAME = game;

  global.GD_INPUT.init(canvas);

  function startRun() {
    game.run = global.GD_WORLD.newRun();
    game.state = 'play';
    global.GD_SOUND.unlock();
    global.GD_SOUND.startMusic();
    global.GD_SOUND.gobble();
  }

  function endRun(kind) {
    game.endKind = kind;
    game.state = 'end';
    game.bestScore = Math.max(game.bestScore, game.run.score);
    global.GD_SOUND.stopMusic();
    if (kind === 'escaped') global.GD_SOUND.escaped();
    else global.GD_SOUND.caught();
  }

  function frame(ts) {
    var dtMs = Math.min(50, ts - (game.lastTs || ts));
    game.lastTs = ts;
    game.t += dtMs;
    var input = global.GD_INPUT;

    if (input.wasPressed('mute')) {
      var m = global.GD_SOUND.toggleMute();
      if (!m) global.GD_SOUND.unlock();
    }

    if (game.state === 'title') {
      global.GD_ART.drawTitle(ctx, game.t);
      if (input.wasPressed('jump') || input.wasPressed('confirm') || input.mouseClicked()) {
        global.GD_SOUND.click();
        startRun();
      }
    } else if (game.state === 'play') {
      if (input.wasPressed('pause')) {
        game.state = 'paused';
        global.GD_SOUND.stopMusic();
      } else {
        global.GD_WORLD.update(game.run, input, dtMs);
        if (game.run.dead) endRun('caught');
        else if (game.run.escaped) endRun('escaped');
        else global.GD_WORLD.render(game.run, ctx, game.t);
      }
    } else if (game.state === 'paused') {
      global.GD_WORLD.render(game.run, ctx, game.t);
      global.GD_ART.drawPaused(ctx);
      if (input.wasPressed('pause')) {
        game.state = 'play';
        global.GD_SOUND.startMusic();
      }
    } else if (game.state === 'end') {
      // end panel paints its own opaque backdrop; the run is not shown behind it
      global.GD_ART.drawEnd(ctx, {
        endKind: game.endKind,
        score: game.run.score,
        distanceM: game.run.distanceM,
        bestScore: game.bestScore
      }, game.t);
      if (input.wasPressed('restart') || input.wasPressed('jump') || input.wasPressed('confirm') || input.mouseClicked()) {
        global.GD_SOUND.click();
        startRun();
      }
    }
    input.endFrame();
    global.requestAnimationFrame(frame);
  }

  // deterministic screenshot scenes for the maker
  var shot = global.GD_SHOTS.shotFromUrl();
  if (shot) {
    if (shot === 'title') {
      game.state = 'title';
    } else {
      global.GD_SHOTS.applyShot(game, shot);
      if (game.state === 'end') {
        game.bestScore = game.run.score;
      }
    }
  }

  global.requestAnimationFrame(frame);
})(this);
