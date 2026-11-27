// Gobble Dash — the run itself: entities, spawning, collisions, the farmer's mind.
(function (global) {
  'use strict';
  var CFG = global.GD_CONFIG;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // entity kinds: fence, haybale, haystack, oven, knife, pin, corn, pie
  function newRun() {
    return {
      distanceM: 0,
      score: 0,
      lives: CFG.MAX_LIVES,
      speed: CFG.BASE_SPEED,
      farmerGap: CFG.FARMER_START_GAP,
      farmerState: 'chase',   // chase | search | burst
      farmerTimer: 0,
      turkeyY: CFG.GROUND_Y,  // feet y
      turkeyVy: 0,
      turkeyX: CFG.TURKEY_X,
      onGround: true,
      sliding: false,
      slideUntil: 0,
      hiddenUntil: 0,
      invulnUntil: 0,
      spottedFlash: 0,
      hideHint: false,
      scroll: 0,
      phase: 0,
      timeMs: 0,
      nextSpawnM: 30,
      entities: [],
      stage: 1,
      bestCombo: 0,
      combo: 0
    };
  }

  function spawnGroup(run) {
    var m = run.distanceM;
    var stage = m >= CFG.STAGE2_AT_M ? 2 : 1;
    var x = 1280 + rand(60, 260);
    var roll = Math.random();
    if (stage === 1) {
      if (roll < 0.22) {
        run.entities.push({ kind: 'fence', x: x, w: 110, passed: false });
      } else if (roll < 0.38) {
        run.entities.push({ kind: 'haybale', x: x, passed: false });
      } else if (roll < 0.52) {
        run.entities.push({ kind: 'haystack', x: x, passed: false });
      } else if (roll < 0.70) {
        run.entities.push({ kind: 'knife', x: x + rand(-40, 40), y: -140, vy: 0, state: 'falling', telegraph: 0, passed: false });
      } else if (roll < 0.86) {
        // corn trail
        for (var i = 0; i < 4; i++) run.entities.push({ kind: 'corn', x: x + i * 70, y: CFG.GROUND_Y - 120, got: false });
      } else {
        run.entities.push({ kind: 'pie', x: x, y: CFG.GROUND_Y - 130, got: false });
      }
    } else {
      if (roll < 0.26) {
        run.entities.push({ kind: 'oven', x: x, passed: false });
      } else if (roll < 0.46) {
        run.entities.push({ kind: 'pin', x: x, y: CFG.GROUND_Y - 14, rot: 0, passed: false });
      } else if (roll < 0.64) {
        run.entities.push({ kind: 'knife', x: x + rand(-40, 40), y: -140, vy: 0, state: 'falling', telegraph: 0, passed: false });
        run.entities.push({ kind: 'knife', x: x + 190, y: -140, vy: 0, state: 'falling', telegraph: 0, passed: false });
      } else if (roll < 0.80) {
        run.entities.push({ kind: 'haybale', x: x, passed: false });
      } else {
        for (var j = 0; j < 4; j++) run.entities.push({ kind: 'corn', x: x + j * 70, y: CFG.GROUND_Y - 120, got: false });
      }
    }
    run.nextSpawnM = m + rand(CFG.SPAWN_GAP_MIN_M, CFG.SPAWN_GAP_MAX_M) * (stage === 2 ? 0.85 : 1);
  }

  function turkeyBox(run) {
    var h = run.sliding ? 110 : 235;
    var yTop = run.turkeyY - h;
    return { x: run.turkeyX - 62, y: yTop, w: 128, h: h };
  }

  function hit(run, reason) {
    var now = run.timeMs;
    if (now < run.invulnUntil) return;
    run.lives -= 1;
    run.combo = 0;
    run.farmerGap = Math.max(CFG.FARMER_CATCH_GAP + 30, run.farmerGap - CFG.FARMER_CLOSE_PER_HIT);
    run.invulnUntil = now + CFG.INVULN_MS;
    run.spottedFlash = 1;
    run.speed = Math.max(CFG.BASE_SPEED, run.speed - 1.2);
    global.GD_SOUND.hit();
    global.GD_SOUND.spotted();
    if (run.lives <= 0) run.dead = reason || 'hit';
  }

  function update(run, input, dtMs) {
    var now = run.timeMs + dtMs;
    run.timeMs = now;
    var dt = dtMs / 16.7;
    run.phase += 0.22 * dt * (run.speed / CFG.BASE_SPEED);
    var stage = run.distanceM >= CFG.STAGE2_AT_M ? 2 : 1;
    run.stage = stage;

    // --- player speed control ---
    var target = CFG.BASE_SPEED + Math.min(2.2, run.distanceM / 500);
    if (input.held('right')) target += 1.8;
    if (input.held('left')) target -= 2.2;
    target = clamp(target, 2.6, CFG.MAX_SPEED);
    run.speed += (target - run.speed) * 0.08 * dt;
    if (run.speed >= CFG.BASE_SPEED + 1.4) {
      run.farmerGap = Math.min(CFG.FARMER_START_GAP, run.farmerGap + CFG.FARMER_PUSHBACK_FULLSPEED * dt);
    }

    // --- jump / slide ---
    if (input.wasPressed('jump') && run.onGround && now >= run.hiddenUntil) {
      run.turkeyVy = CFG.JUMP_V;
      run.onGround = false;
      global.GD_SOUND.jump();
    }
    if (input.wasPressed('slide') && run.onGround) {
      run.sliding = true;
      run.slideUntil = now + CFG.SLIDE_MS;
    }
    if (run.sliding && now >= run.slideUntil) run.sliding = false;
    run.turkeyVy += CFG.GRAVITY * dt;
    run.turkeyY += run.turkeyVy * dt;
    if (run.turkeyY >= CFG.GROUND_Y) {
      if (!run.onGround) global.GD_SOUND.land();
      run.turkeyY = CFG.GROUND_Y;
      run.turkeyVy = 0;
      run.onGround = true;
    }

    // --- hide in haystack ---
    var nearHay = null;
    for (var i = 0; i < run.entities.length; i++) {
      var e = run.entities[i];
      if (e.kind === 'haystack' && Math.abs(e.x - run.turkeyX) < 190) nearHay = e;
    }
    run.hideHint = !!nearHay && now >= run.hiddenUntil;
    if (input.wasPressed('hide') && nearHay && now >= run.hiddenUntil) {
      run.hiddenUntil = now + CFG.HIDE_MS;
      run.farmerState = 'search';
      run.farmerTimer = CFG.HIDE_MS + 400;
      run.farmerGap = Math.min(CFG.FARMER_START_GAP, run.farmerGap + 70);
      global.GD_SOUND.hide();
    }
    var hidden = now < run.hiddenUntil;

    // --- distance & score ---
    var dx = run.speed * dt;
    run.scroll += dx;
    run.distanceM += dx / 10;
    run.score += dx / 10; // fractional: floored only when displayed
    if (run.distanceM >= run.nextSpawnM) spawnGroup(run);

    // --- farmer AI ---
    if (run.farmerState === 'search') {
      run.farmerTimer -= dtMs;
      if (run.farmerTimer <= 0) run.farmerState = 'chase';
    } else if (run.farmerState === 'burst' || (stage === 2 && Math.random() < 0.002 * dt)) {
      if (run.farmerState !== 'burst') { run.farmerState = 'burst'; run.farmerTimer = 900; }
      run.farmerTimer -= dtMs;
      run.farmerGap = Math.max(CFG.FARMER_CATCH_GAP + 14, run.farmerGap - 1.1 * dt);
      if (run.farmerTimer <= 0) run.farmerState = 'chase';
    } else {
      // chase: slowly gains unless the turkey runs hard or grabs corn
      run.farmerGap -= 0.06 * dt;
      if (run.speed < CFG.BASE_SPEED) run.farmerGap -= 0.10 * dt;
    }
    run.farmerGap = clamp(run.farmerGap, CFG.FARMER_CATCH_GAP, CFG.FARMER_START_GAP + 40);
    if (run.farmerGap <= CFG.FARMER_CATCH_GAP + 2 && !hidden) {
      run.dead = 'caught';
    }
    if (run.spottedFlash > 0) run.spottedFlash -= dtMs / 900;

    // --- entities ---
    var box = turkeyBox(run);
    for (var k = run.entities.length - 1; k >= 0; k--) {
      var en = run.entities[k];
      en.x -= dx;
      if (en.kind === 'knife') {
        if (en.state === 'falling') {
          en.telegraph += dtMs;
          if (en.telegraph > 350) {
            en.vy += 1.1 * dt;
            en.y += en.vy * dt;
            if (en.telegraph < 420) global.GD_SOUND.knifeWhistle();
          }
          if (en.y >= CFG.GROUND_Y - 6) { en.y = CFG.GROUND_Y - 6; en.state = 'stuck'; en.stuckUntil = now + 1400; }
        } else if (en.state === 'stuck' && now >= en.stuckUntil) {
          run.entities.splice(k, 1);
          continue;
        }
        if (!hidden && en.y > CFG.GROUND_Y - 260 && Math.abs(en.x - run.turkeyX) < 46 && box.y + box.h > en.y - 130) {
          hit(run, 'knife');
          run.entities.splice(k, 1);
          continue;
        }
      } else if (en.kind === 'pin') {
        en.rot += 0.12 * dt;
        en.x -= 2.2 * dt;
        if (!hidden && box.y + box.h > CFG.GROUND_Y - 40 && Math.abs(en.x - run.turkeyX) < 70 && run.onGround) {
          hit(run, 'pin');
          run.entities.splice(k, 1);
          continue;
        }
      } else if (en.kind === 'corn' || en.kind === 'pie') {
        if (!en.got && !hidden && Math.abs(en.x - run.turkeyX) < 70 && box.y < en.y + 30 && box.y + box.h > en.y - 30) {
          en.got = true;
          if (en.kind === 'corn') {
            run.score += CFG.CORN_POINTS;
            run.farmerGap = Math.min(CFG.FARMER_START_GAP, run.farmerGap + CFG.FARMER_PUSHBACK_CORN);
            global.GD_SOUND.corn();
          } else {
            run.score += CFG.PIE_POINTS;
            if (run.lives < CFG.MAX_LIVES) run.lives += 1;
            global.GD_SOUND.pie();
          }
          run.combo += 1;
          run.bestCombo = Math.max(run.bestCombo, run.combo);
        }
      } else if (en.kind === 'fence' || en.kind === 'haybale' || en.kind === 'oven') {
        var top = en.kind === 'oven' ? CFG.GROUND_Y - 200 : (en.kind === 'fence' ? CFG.GROUND_Y - 86 : CFG.GROUND_Y - 70);
        var ew = en.kind === 'oven' ? 220 : (en.kind === 'fence' ? (en.w || 110) : 104);
        var ex = en.kind === 'oven' ? en.x - 110 : en.x - ew / 2;
        if (!hidden && box.y + box.h > top + 14 && box.x + box.w > ex + 12 && box.x < ex + ew - 12) {
          if (!en.passed) {
            hit(run, en.kind);
            en.passed = true;
          }
        } else if (!en.passed && ex + ew < box.x) {
          en.passed = true;
          run.score += 25;
        }
      }
      if (en.x < -320) run.entities.splice(k, 1);
    }

    // --- escape ---
    if (run.distanceM >= CFG.ESCAPE_DISTANCE_M) {
      run.escaped = true;
    }
  }

  function render(run, ctx, t) {
    var Art = global.GD_ART;
    var now = run.timeMs;
    var hidden = now < run.hiddenUntil;
    if (run.stage === 2) Art.drawKitchen(ctx, run.scroll, t);
    else Art.drawSkyFarm(ctx, run.scroll, t);

    // haystacks first (turkey can hide behind one)
    run.entities.forEach(function (e) {
      if (e.kind === 'haystack') Art.drawHaystack(ctx, e.x, CFG.GROUND_Y, 1);
    });
    // pickups
    run.entities.forEach(function (e) {
      if (e.got) return;
      if (e.kind === 'corn') Art.drawCorn(ctx, e.x, e.y, Math.sin(now / 300 + e.x) * 4);
      if (e.kind === 'pie') Art.drawPie(ctx, e.x, e.y, Math.sin(now / 300 + e.x) * 5);
    });
    // obstacles
    run.entities.forEach(function (e) {
      if (e.kind === 'fence') Art.drawFence(ctx, e.x - 55, CFG.GROUND_Y, e.w || 110);
      if (e.kind === 'haybale') Art.drawHayBale(ctx, e.x, CFG.GROUND_Y);
      if (e.kind === 'oven') Art.drawOven(ctx, e.x, CFG.GROUND_Y, 18 + Math.sin(now / 120) * 8);
      if (e.kind === 'pin') Art.drawRollingPin(ctx, e.x, e.y, e.rot);
      if (e.kind === 'knife') {
        if (e.state === 'falling' && e.telegraph <= 350) {
          // telegraph: shadow + warning on the ground where it will land
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.beginPath(); ctx.ellipse(e.x, CFG.GROUND_Y - 4, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#d62828';
          ctx.font = 'bold 34px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', e.x, CFG.GROUND_Y - 110 + Math.sin(now / 90) * 6);
        } else {
          Art.drawKnife(ctx, e.x, e.y, 0);
        }
      }
    });
    // farmer (behind the turkey on screen)
    var farmerX = run.turkeyX - run.farmerGap - 60;
    Art.drawFarmer(ctx, farmerX, CFG.GROUND_Y, 1.05, run.phase * 1.15, run.farmerState === 'search');
    // turkey
    var blink = now < run.invulnUntil && Math.floor(now / 120) % 2 === 0;
    if (!blink) Art.drawTurkey(ctx, run.turkeyX, run.turkeyY, 1.0, run.phase, run.sliding, hidden);
    // hiding: turkey inside the haystack, show a feather tuft
    if (hidden) {
      ctx.save();
      ctx.translate(run.turkeyX, CFG.GROUND_Y - 120);
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath(); ctx.ellipse(0, 0, 26, 12, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // HUD
    Art.drawHUD(ctx, {
      score: run.score,
      distanceM: run.distanceM,
      lives: run.lives,
      stage: run.stage,
      farmerGap: run.farmerGap,
      spottedFlash: run.spottedFlash,
      hideHint: run.hideHint
    });
  }

  global.GD_WORLD = { newRun: newRun, update: update, render: render, spawnGroup: spawnGroup };
})(this);
