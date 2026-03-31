# Driver Test Game

A reaction-testing web game where you control **two balls simultaneously** on separate scrolling roads. Keep both balls inside the road lines as long as possible — the speed increases over time!

## How to Play

1. Open `index.html` in your browser
2. Click **Start Test**
3. Controls:
   - **Left ball**: `A` (left) / `D` (right)
   - **Right ball**: `←` (left) / `→` (right)
   - **Pause**: `Space`
4. You start with **1000 lives** (500 per ball). Each frame a ball is off-road, you lose 1 life
5. The road speed increases every 15 seconds — survive as long as you can!

## Features

- Dual-ball gameplay with independent keyboard controls
- Infinite scrolling road animation on HTML5 Canvas
- Pixel-perfect collision detection using the [Midpoint Circle Algorithm](https://en.wikipedia.org/wiki/Midpoint_circle_algorithm)
- Progressive difficulty — road speed increases over time
- Pause / resume with Space
- High score saved in localStorage
- Game Over screen with stats and record tracking
- Audio feedback when off-road

## Tech Stack

- **HTML5 Canvas** — rendering and pixel-based collision detection
- **CSS3** — layout, gradients, animations
- **Vanilla JavaScript (ES6)** — game loop with `requestAnimationFrame`, classes, event handling

## Project Structure

```
├── index.html          # Main page
├── game.css            # Styles
├── index.js            # Game loop, controls, UI
├── balls.js            # Ball class
├── roads.js            # Road class (infinite scroll)
├── chrono.js           # Chronometer class
├── checkOnRoad.js      # Pixel collision detection
└── images/
    ├── Circulo_verde.png
    ├── left-road-image.png
    ├── right-road-image.png
    └── beep.mov
```

## Running Locally

No build step needed — just open `index.html` in any modern browser.

```bash
# Or use a local server to avoid CORS issues with audio:
npx serve .
```
