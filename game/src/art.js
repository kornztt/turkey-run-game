// Gobble Dash — every picture in the game, drawn fresh on canvas. No image files.
(function (global) {
  'use strict';
  var C = global.GD_CONFIG.COLORS;
  var CFG = global.GD_CONFIG;

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function ellipse(ctx, x, y, rx, ry, rot) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2);
    ctx.fill();
  }

  var Art = {
    // ---- characters ----
    drawTurkey: function (ctx, x, y, s, phase, sliding, hidden) {
      // x,y = feet centre; s = scale (1 = ~250px tall); phase = run cycle
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      if (sliding) { ctx.translate(0, 62); ctx.scale(1.25, 0.55); }
      if (hidden) ctx.globalAlpha = 0.0; // hidden inside a haystack: not drawn
      var legSwing = Math.sin(phase) * 26;
      // legs
      ctx.strokeStyle = '#e07b39'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-14, -58); ctx.lineTo(-14 + legSwing, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16, -58); ctx.lineTo(16 - legSwing, 0); ctx.stroke();
      // feet
      ctx.strokeStyle = '#e07b39'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(-14 + legSwing, 0); ctx.lineTo(-26 + legSwing, 6); ctx.moveTo(-14 + legSwing, 0); ctx.lineTo(-4 + legSwing, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16 - legSwing, 0); ctx.lineTo(4 - legSwing, 6); ctx.moveTo(16 - legSwing, 0); ctx.lineTo(28 - legSwing, 7); ctx.stroke();
      // tail fan
      var tailCols = ['#b5651d', '#d2691e', '#8b4513', '#e07a2f', '#a0522d'];
      for (var i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(-52, -150);
        ctx.rotate(-0.9 + i * 0.42);
        ctx.fillStyle = tailCols[i];
        ctx.beginPath(); ctx.ellipse(0, -58, 20, 62, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,215,130,0.85)';
        ctx.beginPath(); ctx.ellipse(0, -96, 7, 12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      // body
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath(); ctx.ellipse(0, -118, 78, 92, 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c68a4b';
      ctx.beginPath(); ctx.ellipse(14, -96, 52, 62, 0.12, 0, Math.PI * 2); ctx.fill();
      // wing
      ctx.fillStyle = '#6f4520';
      ctx.beginPath(); ctx.ellipse(-8, -118, 46, 58, -0.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#4a2c12'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-30, -150); ctx.quadraticCurveTo(0, -120, -22, -84); ctx.stroke();
      // neck + head
      ctx.fillStyle = '#d96c4a';
      ctx.beginPath(); ctx.ellipse(52, -196, 26, 34, 0.25, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(66, -226, 30, 0, Math.PI * 2); ctx.fill();
      // wattle
      ctx.fillStyle = '#c1121f';
      ctx.beginPath(); ctx.ellipse(78, -204, 9, 18, 0.3, 0, Math.PI * 2); ctx.fill();
      // beak
      ctx.fillStyle = '#ffb703';
      ctx.beginPath(); ctx.moveTo(90, -232); ctx.lineTo(116, -222); ctx.lineTo(90, -212); ctx.closePath(); ctx.fill();
      // snood
      ctx.fillStyle = '#c1121f';
      ctx.beginPath(); ctx.ellipse(96, -240, 5, 12, 0.4, 0, Math.PI * 2); ctx.fill();
      // eye
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(74, -234, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d130b';
      ctx.beginPath(); ctx.arc(77, -234, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    },

    drawFarmer: function (ctx, x, y, s, phase, searching) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      var legSwing = Math.sin(phase) * 30;
      // legs (overalls)
      ctx.strokeStyle = '#2b4c7e'; ctx.lineWidth = 16; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-12, -120); ctx.lineTo(-12 + legSwing, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, -120); ctx.lineTo(14 - legSwing, 0); ctx.stroke();
      // torso: red plaid shirt
      ctx.fillStyle = '#b02e2e';
      rr(ctx, -42, -215, 88, 100, 16); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-42, -185); ctx.lineTo(46, -185); ctx.moveTo(-42, -155); ctx.lineTo(46, -155); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-14, -215); ctx.lineTo(-14, -115); ctx.moveTo(16, -215); ctx.lineTo(16, -115); ctx.stroke();
      // overall straps + bib
      ctx.fillStyle = '#2b4c7e';
      ctx.fillRect(-34, -215, 12, 46); ctx.fillRect(22, -215, 12, 46);
      rr(ctx, -36, -180, 76, 62, 8); ctx.fill();
      // arm + pitchfork (held forward)
      ctx.strokeStyle = '#b02e2e'; ctx.lineWidth = 14;
      ctx.beginPath(); ctx.moveTo(30, -200); ctx.lineTo(72, -168); ctx.stroke();
      ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(66, -168); ctx.lineTo(128, -236); ctx.stroke();
      ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 4;
      for (var t = -1; t <= 1; t++) {
        ctx.beginPath(); ctx.moveTo(128 + t * 8, -236); ctx.lineTo(140 + t * 10, -272); ctx.stroke();
      }
      // head
      ctx.fillStyle = '#f2c29b';
      ctx.beginPath(); ctx.arc(4, -246, 32, 0, Math.PI * 2); ctx.fill();
      // mustache + angry brows
      ctx.fillStyle = '#5a3a1a';
      ctx.beginPath(); ctx.ellipse(8, -232, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-12, -258); ctx.lineTo(2, -252); ctx.moveTo(22, -258); ctx.lineTo(10, -252); ctx.stroke();
      // eyes
      ctx.fillStyle = '#1d130b';
      ctx.beginPath(); ctx.arc(-6, -250, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(16, -250, 3.5, 0, Math.PI * 2); ctx.fill();
      // straw hat
      ctx.fillStyle = '#e9c46a';
      ctx.beginPath(); ctx.ellipse(4, -268, 52, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(4, -282, 30, 20, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#b02e2e'; ctx.fillRect(-24, -280, 56, 7);
      // searching: a big "?" bubble
      if (searching) {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(66, -330, 26, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2b1a0e'; ctx.font = 'bold 34px system-ui, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('?', 66, -330);
      }
      ctx.restore();
    },

    // ---- hazards & pickups ----
    drawFence: function (ctx, x, y, w) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#7a4a21';
      ctx.fillRect(-6, -86, 12, 86); ctx.fillRect(w - 6, -86, 12, 86);
      ctx.fillStyle = '#96622f';
      ctx.fillRect(-14, -78, w + 28, 14); ctx.fillRect(-14, -44, w + 28, 14);
      ctx.restore();
    },
    drawHayBale: function (ctx, x, y) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#e9c46a';
      ctx.beginPath(); ctx.ellipse(0, -34, 52, 36, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#b98a2e'; ctx.lineWidth = 3;
      for (var i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.moveTo(i * 18, -64); ctx.quadraticCurveTo(i * 22, -34, i * 18, -6); ctx.stroke();
      }
      ctx.restore();
    },
    drawHaystack: function (ctx, x, y, s) {
      ctx.save(); ctx.translate(x, y); ctx.scale(s || 1, s || 1);
      ctx.fillStyle = '#d9a441';
      ctx.beginPath(); ctx.moveTo(-95, 0); ctx.quadraticCurveTo(-70, -130, 0, -150);
      ctx.quadraticCurveTo(70, -130, 95, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#a87c22'; ctx.lineWidth = 3;
      for (var i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(i * 24, -8); ctx.quadraticCurveTo(i * 28, -70, i * 16, -132); ctx.stroke();
      }
      ctx.restore();
    },
    drawOven: function (ctx, x, y, flameH) {
      ctx.save(); ctx.translate(x, y);
      // body
      ctx.fillStyle = '#3d3d3d';
      rr(ctx, -110, -200, 220, 200, 12); ctx.fill();
      ctx.fillStyle = '#555';
      rr(ctx, -100, -190, 200, 26, 8); ctx.fill();
      // door window with glow
      ctx.fillStyle = '#ff9e00';
      rr(ctx, -78, -150, 156, 110, 10); ctx.fill();
      ctx.fillStyle = '#ff6d00';
      rr(ctx, -70, -142, 140, 94, 8); ctx.fill();
      // flames licking out of the door
      ctx.fillStyle = '#ffb703';
      for (var i = 0; i < 5; i++) {
        var fx = -64 + i * 32;
        var fh = 34 + flameH + Math.sin((Date.now() / 90) + i * 1.7) * 10;
        ctx.beginPath();
        ctx.moveTo(fx - 12, -46); ctx.quadraticCurveTo(fx, -46 - fh, fx + 12, -46);
        ctx.closePath(); ctx.fill();
      }
      // knobs + HOT sign
      ctx.fillStyle = '#ddd';
      ctx.beginPath(); ctx.arc(-70, -177, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(-40, -177, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d62828';
      rr(ctx, -34, -196, 68, 26, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 17px system-ui, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('HOT!', 0, -182);
      ctx.restore();
    },
    drawKnife: function (ctx, x, y, rot) {
      // y = tip position; knife points down
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
      ctx.fillStyle = '#c0c0c0';
      ctx.beginPath(); ctx.moveTo(-11, -96); ctx.lineTo(11, -96); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath(); ctx.moveTo(-11, -96); ctx.lineTo(-3, -96); ctx.lineTo(0, -8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5a3a1a';
      rr(ctx, -13, -132, 26, 38, 8); ctx.fill();
      ctx.restore();
    },
    drawRollingPin: function (ctx, x, y, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
      ctx.fillStyle = '#c68a4b';
      rr(ctx, -52, -13, 104, 26, 13); ctx.fill();
      ctx.fillStyle = '#8a5a2b';
      ctx.fillRect(-66, -8, 14, 16); ctx.fillRect(52, -8, 14, 16);
      ctx.restore();
    },
    drawCorn: function (ctx, x, y, bob) {
      ctx.save(); ctx.translate(x, y + bob);
      ctx.fillStyle = '#ffd60a';
      ctx.beginPath(); ctx.ellipse(0, 0, 16, 26, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e0a800';
      for (var r = -1; r <= 1; r++) for (var c = -1; c <= 1; c++) {
        ctx.beginPath(); ctx.arc(r * 9, c * 13, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#588157';
      ctx.beginPath(); ctx.moveTo(-14, 8); ctx.lineTo(-26, 30); ctx.lineTo(-4, 22); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(14, 8); ctx.lineTo(26, 30); ctx.lineTo(4, 22); ctx.closePath(); ctx.fill();
      ctx.restore();
    },
    drawPie: function (ctx, x, y, bob) {
      ctx.save(); ctx.translate(x, y + bob);
      ctx.fillStyle = '#c68a4b';
      ctx.beginPath(); ctx.moveTo(-30, 10); ctx.lineTo(30, 10); ctx.lineTo(18, -22); ctx.lineTo(-18, -22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#a0522d';
      ctx.beginPath(); ctx.moveTo(-24, 4); ctx.lineTo(24, 4); ctx.lineTo(16, -18); ctx.lineTo(-16, -18); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-18, -2); ctx.lineTo(18, -14); ctx.moveTo(18, -2); ctx.lineTo(-18, -14); ctx.stroke();
      ctx.restore();
    },
    drawPumpkin: function (ctx, x, y, s) {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = '#e07a2f';
      ctx.beginPath(); ctx.ellipse(0, -22, 34, 26, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d2691e';
      ctx.beginPath(); ctx.ellipse(-14, -22, 12, 24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(14, -22, 12, 24, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#588157';
      ctx.fillRect(-4, -52, 8, 14);
      ctx.restore();
    },

    // ---- backgrounds ----
    drawSkyFarm: function (ctx, scroll, t) {
      var g = ctx.createLinearGradient(0, 0, 0, 620);
      g.addColorStop(0, C.skyTop); g.addColorStop(0.55, C.skyMid); g.addColorStop(1, C.skyBot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 620);
      // sun
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath(); ctx.arc(1080, 110, 52, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,243,176,0.7)'; ctx.lineWidth = 6;
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4 + t * 0.05;
        ctx.beginPath();
        ctx.moveTo(1080 + Math.cos(a) * 64, 110 + Math.sin(a) * 64);
        ctx.lineTo(1080 + Math.cos(a) * 84, 110 + Math.sin(a) * 84);
        ctx.stroke();
      }
      // clouds
      ctx.fillStyle = 'rgba(255,248,235,0.9)';
      [[200, 90], [560, 60], [900, 150]].forEach(function (p, k) {
        var cx = ((p[0] - scroll * 0.08 + k * 400) % 1400 + 1400) % 1400 - 60;
        ellipse(ctx, cx, p[1], 70, 22, 0); ellipse(ctx, cx + 44, p[1] + 8, 48, 18, 0); ellipse(ctx, cx - 44, p[1] + 8, 44, 16, 0);
      });
      // distant barn + trees
      var barnX = ((420 - scroll * 0.25) % 1600 + 1600) % 1600 - 160;
      ctx.fillStyle = '#a83232';
      ctx.fillRect(barnX, 380, 220, 150);
      ctx.fillStyle = '#7c2424';
      ctx.beginPath(); ctx.moveTo(barnX - 12, 380); ctx.lineTo(barnX + 110, 300); ctx.lineTo(barnX + 232, 380); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(barnX + 88, 440, 44, 90);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
      ctx.strokeRect(barnX + 88, 440, 44, 90);
      ctx.beginPath(); ctx.moveTo(barnX + 88, 440); ctx.lineTo(barnX + 132, 530); ctx.moveTo(barnX + 132, 440); ctx.lineTo(barnX + 88, 530); ctx.stroke();
      [[150, 470, 90], [760, 450, 110], [1150, 480, 80]].forEach(function (tr, k) {
        var tx = ((tr[0] - scroll * 0.35 + k * 500) % 1500 + 1500) % 1500 - 110;
        ctx.fillStyle = '#7a3b12';
        ctx.fillRect(tx - 8, tr[1], 16, 60);
        ctx.fillStyle = ['#d2691e', '#e07a2f', '#b5651d'][k];
        ctx.beginPath(); ctx.arc(tx, tr[1] - 30, tr[2] / 2 + 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(tx - 34, tr[1], 30, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(tx + 34, tr[1], 30, 0, Math.PI * 2); ctx.fill();
      });
      // ground
      ctx.fillStyle = C.groundFarm;
      ctx.fillRect(0, 600, 1280, 120);
      ctx.fillStyle = C.groundFarmTop;
      ctx.fillRect(0, 600, 1280, 14);
      // fence line along horizon
      ctx.fillStyle = '#6b4423';
      for (var fx = -((scroll * 0.6) % 90); fx < 1290; fx += 90) {
        ctx.fillRect(fx, 566, 10, 36);
      }
      ctx.fillRect(0, 576, 1280, 8); ctx.fillRect(0, 592, 1280, 8);
    },
    drawKitchen: function (ctx, scroll, t) {
      // wall
      ctx.fillStyle = C.kitchenWall; ctx.fillRect(0, 0, 1280, 600);
      ctx.strokeStyle = 'rgba(180,140,90,0.5)'; ctx.lineWidth = 2;
      for (var ty = 0; ty < 600; ty += 60) { ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(1280, ty); ctx.stroke(); }
      for (var tx = 0; tx < 1280; tx += 60) { ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, 600); ctx.stroke(); }
      // window with night sky
      ctx.fillStyle = '#2b3a67';
      rr(ctx, 90, 70, 220, 180, 10); ctx.fill();
      ctx.fillStyle = '#f4e3c2';
      ctx.fillRect(190, 70, 12, 180); ctx.fillRect(90, 150, 220, 12);
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath(); ctx.arc(150, 120, 22, 0, Math.PI * 2); ctx.fill();
      // hanging pots
      [480, 620, 760].forEach(function (px, k) {
        ctx.strokeStyle = '#555'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, 60); ctx.stroke();
        ctx.fillStyle = ['#8a8a8a', '#5a5a5a', '#a8a8a8'][k];
        ctx.beginPath(); ctx.arc(px, 96, 42, 0, Math.PI); ctx.fill();
        ctx.fillRect(px - 42, 92, 84, 8);
      });
      // shelf with jars
      ctx.fillStyle = '#8a5a2b'; ctx.fillRect(900, 200, 300, 16);
      [[930, '#d2691e'], [990, '#588157'], [1050, '#e9c46a'], [1110, '#b02e2e']].forEach(function (j) {
        ctx.fillStyle = j[1];
        rr(ctx, j[0], 150, 40, 50, 8); ctx.fill();
      });
      // checkered floor
      for (var fy = 0; fy < 2; fy++) for (var fx2 = 0; fx2 < 16; fx2++) {
        ctx.fillStyle = (fx2 + fy) % 2 ? '#c98a4b' : '#e9c46a';
        ctx.fillRect(fx2 * 80, 600 + fy * 60, 80, 60);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, 600, 1280, 8);
    },

    // ---- HUD & screens ----
    drawHUD: function (ctx, s) {
      ctx.save();
      ctx.fillStyle = C.hudBg;
      rr(ctx, 16, 14, 1248, 76, 14); ctx.fill();
      ctx.textBaseline = 'middle';
      ctx.fillStyle = C.hudText;
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE  ' + Math.floor(s.score), 36, 40);
      ctx.fillText('DIST  ' + Math.floor(s.distanceM) + ' m', 36, 68);
      ctx.textAlign = 'center';
      ctx.fillStyle = C.hudAccent;
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.fillText(s.stage === 2 ? 'STAGE 2 · THE KITCHEN' : 'STAGE 1 · THE FARMYARD', 640, 40);
      ctx.fillStyle = C.hudText;
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillText(s.distanceM >= 1200 ? 'FREEDOM!' : Math.floor(1200 - s.distanceM) + ' m to freedom', 640, 68);
      // lives
      ctx.textAlign = 'right';
      for (var i = 0; i < CFG.MAX_LIVES; i++) {
        ctx.fillStyle = i < s.lives ? '#ff4d6d' : 'rgba(255,255,255,0.25)';
        var hx = 1210 - i * 42, hy = 40;
        ctx.beginPath();
        ctx.moveTo(hx, hy + 10);
        ctx.bezierCurveTo(hx - 16, hy - 6, hx - 8, hy - 18, hx, hy - 8);
        ctx.bezierCurveTo(hx + 8, hy - 18, hx + 16, hy - 6, hx, hy + 10);
        ctx.fill();
      }
      ctx.fillStyle = C.hudText; ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('LIVES', 1240 - CFG.MAX_LIVES * 42 - 12, 40);
      // farmer threat bar
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.lineWidth = 4;
      ctx.strokeText('FARMER', 36, 112);
      ctx.fillStyle = s.farmerGap < 60 ? C.danger : C.hudText;
      ctx.fillText('FARMER', 36, 112);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      rr(ctx, 130, 100, 260, 20, 10); ctx.fill();
      var threat = 1 - Math.max(0, Math.min(1, (s.farmerGap - CFG.FARMER_CATCH_GAP) / (CFG.FARMER_START_GAP - CFG.FARMER_CATCH_GAP)));
      ctx.fillStyle = threat > 0.7 ? C.danger : (threat > 0.4 ? '#ffb703' : C.ok);
      rr(ctx, 130, 100, 260 * threat, 20, 10); ctx.fill();
      if (s.spottedFlash > 0) {
        ctx.fillStyle = 'rgba(214,40,40,' + Math.min(1, s.spottedFlash) + ')';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPOTTED!', 640, 160);
      }
      if (s.hideHint) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press H — HIDE IN THE HAY!', 640, 200);
      }
      ctx.restore();
    },

    drawTitle: function (ctx, t) {
      ctx.save();
      var g = ctx.createLinearGradient(0, 0, 0, 720);
      g.addColorStop(0, '#f7b267'); g.addColorStop(0.6, '#f4845f'); g.addColorStop(1, '#8a5a2b');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
      // falling leaves
      ctx.fillStyle = 'rgba(214,105,30,0.8)';
      for (var i = 0; i < 14; i++) {
        var lx = (i * 173 + t * 22) % 1360 - 40;
        var ly = (i * 97 + t * 34) % 760 - 20;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(t * 0.01 + i);
        ctx.fillRect(-7, -4, 14, 8); ctx.restore();
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#7f1d1d';
      ctx.font = 'bold 96px system-ui, sans-serif';
      ctx.fillText('GOBBLE DASH', 640, 130);
      ctx.fillStyle = '#fff3b0';
      ctx.font = 'bold 96px system-ui, sans-serif';
      ctx.fillText('GOBBLE DASH', 640, 126);
      ctx.fillStyle = '#2b1a0e';
      ctx.font = 'bold 34px system-ui, sans-serif';
      ctx.fillText("A TURKEY'S GREAT ESCAPE", 640, 196);
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText('Thanksgiving is coming. The farmer is coming faster. Run, turkey, run!', 640, 232);
      // big turkey front and centre
      Art.drawTurkey(ctx, 560, 640, 1.15, Math.sin(t * 0.06) * 0.4, false, false);
      // farmer peeking from the side
      Art.drawFarmer(ctx, 1080, 640, 0.85, Math.sin(t * 0.06) * 0.4, false);
      ctx.fillStyle = '#2b1a0e';
      ctx.font = 'bold 30px system-ui, sans-serif';
      var pulse = 0.65 + Math.sin(t * 0.09) * 0.35;
      ctx.globalAlpha = pulse;
      ctx.fillText('PRESS SPACE OR CLICK TO RUN', 640, 690);
      ctx.globalAlpha = 1;
      ctx.font = '20px system-ui, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('SPACE jump  ·  ↓ slide  ·  ← → speed  ·  H hide in hay  ·  dodge knives & ovens', 640, 280);
      ctx.restore();
    },

    drawEnd: function (ctx, s, t) {
      ctx.save();
      // opaque backdrop: the run behind is never shown on the end screen
      ctx.fillStyle = s.endKind === 'escaped' ? '#1d3a1d' : '#3a1414';
      ctx.fillRect(0, 0, 1280, 720);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (s.endKind === 'escaped') {
        ctx.fillStyle = '#80b918';
        ctx.font = 'bold 84px system-ui, sans-serif';
        ctx.fillText('ESCAPED!', 640, 115);
        ctx.fillStyle = '#fff';
        ctx.font = '30px system-ui, sans-serif';
        ctx.fillText('Free at last — no Thanksgiving dinner for you!', 640, 172);
        Art.drawTurkey(ctx, 640, 500, 1.1, Math.sin(t * 0.08) * 0.5, false, false);
      } else {
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 84px system-ui, sans-serif';
        ctx.fillText('CAUGHT!', 640, 115);
        ctx.fillStyle = '#fff';
        ctx.font = '30px system-ui, sans-serif';
        ctx.fillText('Thanksgiving dinner is served… and it is you.', 640, 172);
        Art.drawFarmer(ctx, 640, 480, 0.95, 0, false);
      }
      ctx.fillStyle = '#ffe9b0';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.fillText('SCORE  ' + Math.floor(s.score) + '    ·    DISTANCE  ' + Math.floor(s.distanceM) + ' m', 640, 560);
      ctx.fillStyle = '#fff';
      ctx.font = '26px system-ui, sans-serif';
      ctx.fillText('Best score this session: ' + s.bestScore, 640, 606);
      var pulse = 0.65 + Math.sin(t * 0.09) * 0.35;
      ctx.globalAlpha = pulse;
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.fillText('PRESS R OR CLICK TO RUN AGAIN', 640, 664);
      ctx.globalAlpha = 1;
      ctx.restore();
    },

    drawPaused: function (ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, 1280, 720);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 64px system-ui, sans-serif';
      ctx.fillText('PAUSED', 640, 330);
      ctx.font = '26px system-ui, sans-serif';
      ctx.fillText('Press P to keep running', 640, 400);
      ctx.restore();
    }
  };
  global.GD_ART = Art;
})(this);
