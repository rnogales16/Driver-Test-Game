# PsicoCarnet

Simulador gratuito del test psicotécnico para renovar o sacarte el carnet de conducir en España. Practica la prueba de coordinación bimanual y reflejos.

**[psicocarnet.com](https://psicocarnet.com)**

## Cómo jugar

1. Abre [psicocarnet.com](https://psicocarnet.com)
2. Elige modo **Progresivo** o **Constante**
3. Pulsa **Comenzar**
4. Controles:
   - **Bola izquierda**: `A` / `D`
   - **Bola derecha**: `←` / `→`
   - **Pausa**: `Espacio`
   - **Móvil**: desliza las barras inferiores
5. Mantén ambas bolas dentro de la carretera amarilla el mayor tiempo posible

## Features

- Dos modos de juego: velocidad progresiva o constante
- Controles táctiles para móvil (sliders multi-touch)
- Detección de colisiones por pixel
- Ranking global online (Firebase)
- High score local por modo
- Estadísticas al final: precisión, mejor racha, velocidad máxima
- Pantalla completa
- PWA — se puede instalar como app en móvil
- SEO optimizado con FAQ Schema

## Tech Stack

- **HTML5 Canvas** — renderizado y detección de colisiones
- **CSS3** — diseño responsive, dark theme
- **Vanilla JavaScript (ES6)** — game loop, clases, Web Audio API
- **Firebase Firestore** — leaderboard online
- **GitHub Pages** — hosting
- **Cloudflare** — DNS

## Estructura

```
├── index.html          # Página principal
├── game.css            # Estilos
├── index.js            # Game loop, controles, UI
├── balls.js            # Clase Ball
├── roads.js            # Clase Road (scroll infinito)
├── chrono.js           # Cronómetro
├── checkOnRoad.js      # Detección de colisiones
├── leaderboard.js      # Ranking con Firebase
├── firebase-config.js  # Config de Firebase
├── manifest.json       # PWA manifest
├── sitemap.xml         # Sitemap SEO
├── ads.txt             # Google AdSense
└── images/
    ├── Circulo_verde.png
    ├── left-road-image.svg
    └── right-road-image.svg
```

## Desarrollo local

```bash
npx serve .
```
