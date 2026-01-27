# Battleship Game

This project is part of [The Odin Project's Full Stack JavaScript course - JavaScript](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript). It is a web-based Battleship game where you place ships on a 10×10 grid, then battle an AI opponent by taking turns firing at coordinates until all of one side’s ships are sunk.

Live demo: [https://adjeteysowah.github.io/battleship/](https://adjeteysowah.github.io/battleship/)

---

## Features

- Place ships manually (choose axis and starting cell).
- AI opponent that takes automated turns.
- Visual, responsive 10×10 boards for player and enemy.
- Track hits, misses and show sunk ships.
- Turn-based flow with clear UI feedback.
- Build tooling (Webpack) with separate dev & prod configs.
- Unit-test ready (Jest + Babel setup included).

---

## How to play

1. Open the live demo or run locally.
2. On the placement screen, place your ships on your board:
   - Toggle the axis (horizontal/vertical), choose a starting cell, and place the ship.
   - Repeat until all ships are placed.

3. Begin the battle. The player and AI alternate turns:
   - Click a cell on the enemy board to fire at that coordinate.
   - The game will mark hits (H) and misses (M), and notify when a ship is sunk.

4. Continue until one side has all ships sunk. The winner screen will show the victory and provide a **Play Again** option to reset and start a new match.

---

## Project structure (high level)

- `src/` — app source (modules for ship, gameboard, player, AI, controller, UI)
- `src/index.js` — app entry
- `pages/` — HTML templates for start, placement, battle, winner pages
- `webpack.*.js` — Webpack config (dev / prod / common)
- `.eslintrc`, `.prettierrc` — linting & formatting config
- `tests/` — unit tests (Jest)

---

## Technologies used

- JavaScript (ES Modules)
- HTML5 & CSS3 (mobile-first, responsive)
- Webpack (dev / prod builds)
- Babel (for Jest / compatibility)
- Jest (unit testing)
- ESLint (Airbnb base) + Prettier (formatting)

---

## Credits

- Built as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.
- Inspirations and layout: Alex Younger [https://benders-battleship.netlify.app/](https://benders-battleship.netlify.app/)
