// Gobble Dash — all sound is synthesised with WebAudio, no audio files.
(function (global) {
  'use strict';
  var ctx = null;
  var muted = false;
  var musicTimer = null;

  function ensureCtx() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, durMs, type, vol, slideTo) {
    if (muted) return;
    var c = ensureCtx();
    if (!c) return;
    var t0 = c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + durMs / 1000);
    gain.gain.setValueAtTime(vol || 0.12, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + durMs / 1000);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + durMs / 1000 + 0.02);
  }

  function gobble() {
    // a two-note turkey gobble: low blurt, higher blurt
    tone(180, 120, 'sawtooth', 0.10, 120);
    setTimeout(function () { tone(240, 140, 'sawtooth', 0.10, 160); }, 130);
  }

  var Sound = {
    unlock: function () { ensureCtx(); },
    gobble: gobble,
    toggleMute: function () { muted = !muted; return muted; },
    isMuted: function () { return muted; },
    jump: function () { tone(300, 160, 'triangle', 0.10, 640); },
    land: function () { tone(140, 90, 'sine', 0.08, 90); },
    corn: function () { tone(880, 90, 'sine', 0.10); setTimeout(function () { tone(1320, 120, 'sine', 0.09); }, 70); },
    pie: function () { tone(523, 120, 'triangle', 0.11); setTimeout(function () { tone(659, 120, 'triangle', 0.11); }, 110); setTimeout(function () { tone(784, 200, 'triangle', 0.11); }, 220); },
    hit: function () { tone(220, 220, 'sawtooth', 0.14, 70); tone(90, 260, 'sine', 0.16, 50); },
    spotted: function () { tone(440, 110, 'square', 0.07, 440); setTimeout(function () { tone(587, 130, 'square', 0.07); }, 110); },
    knifeWhistle: function () { tone(1800, 300, 'sine', 0.05, 700); },
    hide: function () { tone(500, 200, 'sine', 0.08, 900); },
    caught: function () {
      tone(392, 220, 'sawtooth', 0.10); setTimeout(function () { tone(370, 220, 'sawtooth', 0.10); }, 220);
      setTimeout(function () { tone(349, 220, 'sawtooth', 0.10); }, 440); setTimeout(function () { tone(311, 480, 'sawtooth', 0.11); }, 660);
    },
    escaped: function () {
      var notes = [523, 659, 784, 1047];
      notes.forEach(function (f, i) { setTimeout(function () { tone(f, 260, 'triangle', 0.12); }, i * 150); });
      setTimeout(gobble, 620);
    },
    click: function () { tone(660, 60, 'sine', 0.08); },
    startMusic: function () {
      // a slow autumn walking bass, very quiet, only while playing
      if (musicTimer) return;
      var bass = [110, 98, 87, 98];
      var i = 0;
      musicTimer = setInterval(function () {
        if (muted) return;
        tone(bass[i % bass.length], 420, 'triangle', 0.035);
        i++;
      }, 460);
    },
    stopMusic: function () {
      if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    }
  };
  global.GD_SOUND = Sound;
})(this);
