# Gobble Dash — A Turkey's Great Escape

[![make.fun](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/kornztt/turkey-run-game/rank.svg)](https://make.fun/bounty/turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/kornztt/turkey-run-game/reward.svg)](https://make.fun/bounty/turkey-run-game-01)

Thanksgiving is coming. The farmer is coming faster. You are the turkey — run!

**Gobble Dash** is a complete, original 2D turkey escape game that plays offline in a
desktop browser from static files. No build step, no network, no libraries: every
picture is drawn fresh on canvas and every sound is synthesised with WebAudio.

## How to play

- **Space / ↑ / W** — jump
- **↓ / S** — slide under low danger
- **← / →** — slow down / sprint (sprinting pushes the farmer back)
- **H** — hide in a haystack when the farmer is searching
- **P** — pause · **M** — mute · **R** — run again

## The escape

- **Stage 1 — The Farmyard (0–600 m):** fences, hay bales and falling carving knives.
  Grab corn for points, grab pumpkin pie for a life.
- **Stage 2 — The Kitchen (600–1200 m):** the oven is hot, rolling pins roll at your
  feet, the farmer bursts forward in sprints.
- **Reach 1200 m** and you are free. Get hit three times — or let the farmer catch
  up — and you are Thanksgiving dinner.

## Layout

- `main.ts` — hands the entry in (copies `game/` + `screenshots/`, writes `dossier.json`)
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged
- `game/index.html` — the page
- `game/src/config.js` — tuning and stage data
- `game/src/audio.js` — synthesised sounds
- `game/src/input.js` — keyboard and mouse
- `game/src/art.js` — all canvas art: turkey, farmer, oven, knife, farm and kitchen
- `game/src/world.js` — entities, spawning, collisions, the farmer's AI
- `game/src/shots.js` — deterministic screenshot scenes (`?shot=title|play|hide|kitchen|caught|escaped`)
- `game/src/main.js` — game loop and screens
- `screenshots/` — real renders of the game (title, farmyard chase, hiding in a haystack, escaped)

## Run it

Serve `game/` with any static server and open `index.html`, e.g.
`python3 -m http.server` inside `game/`, then http://localhost:8000/.
