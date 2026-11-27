// Gobble Dash — keyboard and mouse state, one clear job: turn presses into intents.
(function (global) {
  'use strict';
  var keys = {};
  var pressed = {};   // edge-triggered: true only on the frame the key went down
  var mouse = { x: 0, y: 0, clicked: false, down: false };

  function norm(code) {
    if (code === 'Space') return 'jump';
    if (code === 'ArrowUp' || code === 'KeyW') return 'jump';
    if (code === 'ArrowDown' || code === 'KeyS') return 'slide';
    if (code === 'ArrowLeft' || code === 'KeyA') return 'left';
    if (code === 'ArrowRight' || code === 'KeyD') return 'right';
    if (code === 'KeyH') return 'hide';
    if (code === 'KeyP') return 'pause';
    if (code === 'KeyM') return 'mute';
    if (code === 'KeyR') return 'restart';
    if (code === 'Enter') return 'confirm';
    return null;
  }

  var Input = {
    init: function (canvas) {
      global.addEventListener('keydown', function (e) {
        var k = norm(e.code);
        if (!k) return;
        if (e.code === 'Space' || e.code.indexOf('Arrow') === 0) e.preventDefault();
        if (!keys[k]) pressed[k] = true;
        keys[k] = true;
      });
      global.addEventListener('keyup', function (e) {
        var k = norm(e.code);
        if (k) keys[k] = false;
      });
      canvas.addEventListener('pointerdown', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
        mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
        mouse.clicked = true;
        mouse.down = true;
      });
      canvas.addEventListener('pointerup', function () { mouse.down = false; });
    },
    held: function (k) { return !!keys[k]; },
    // true once, then clears — call once per frame per key
    wasPressed: function (k) {
      var v = !!pressed[k];
      pressed[k] = false;
      return v;
    },
    mouseClicked: function () {
      var v = mouse.clicked;
      mouse.clicked = false;
      return v;
    },
    mousePos: function () { return { x: mouse.x, y: mouse.y }; },
    endFrame: function () {
      // drop stale edge flags so a press is never read twice
      for (var k in pressed) pressed[k] = false;
    }
  };
  global.GD_INPUT = Input;
})(this);
