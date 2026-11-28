// Gobble Dash — tuning and stage data. One clear job: every number the game runs on.
(function (global) {
  'use strict';
  var CFG = {
    VIEW_W: 1280,
    VIEW_H: 720,
    GROUND_Y: 600,
    GRAVITY: 0.85,
    JUMP_V: -16.5,
    SLIDE_MS: 620,
    TURKEY_X: 300,
    TURKEY_W: 150,
    TURKEY_H: 250,
    ESCAPE_DISTANCE_M: 1200,
    STAGE2_AT_M: 600,
    BASE_SPEED: 5.2,
    MAX_SPEED: 9.5,
    FARMER_START_GAP: 190,
    FARMER_CATCH_GAP: 8,
    FARMER_CLOSE_PER_HIT: 46,
    FARMER_PUSHBACK_CORN: 14,
    FARMER_PUSHBACK_FULLSPEED: 0.25,
    HIDE_MS: 2200,
    INVULN_MS: 1400,
    MAX_LIVES: 3,
    CORN_POINTS: 50,
    PIE_POINTS: 200,
    // spawn cadence, in metres between obstacle groups
    SPAWN_GAP_MIN_M: 26,
    SPAWN_GAP_MAX_M: 44,
    KNIFE_FALL_MS: 620,
    // autumn palette
    COLORS: {
      skyTop: '#f7b267', skyMid: '#f4845f', skyBot: '#e76f51',
      groundFarm: '#8a5a2b', groundFarmTop: '#a06b33',
      kitchenWall: '#f4e3c2', kitchenFloor: '#b5651d',
      hudBg: 'rgba(43,26,14,0.78)', hudText: '#ffe9b0', hudAccent: '#ffb703',
      danger: '#d62828', ok: '#80b918'
    }
  };
  global.GD_CONFIG = CFG;
})(this);
