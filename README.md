# theme-shokax-anime

![NPM](https://img.shields.io/npm/l/theme-shokax-anime) ![npm](https://img.shields.io/npm/v/theme-shokax-anime) ![npm](https://img.shields.io/npm/dm/theme-shokax-anime) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/theme-shokax-anime) [![Coverage Status](https://coveralls.io/repos/github/theme-shoka-x/theme-shokax-anime/badge.svg?branch=main)](https://coveralls.io/github/theme-shoka-x/theme-shokax-anime?branch=main)


anime.js for [hexo-theme-shokaX](https://github.com/theme-shoka-x/hexo-theme-shokaX)  
inspired by [anime](https://github.com/juliangarnier/anime)

## Usage
### Import
```html
<script src="https://cdn.jsdelivr.net/npm/theme-shokax-anime@latest/dist/index.umd.js"></script>
```
or
```bash
npm i theme-shokax-anime --save
```

### Basic usage

```javascript
anime({
  targets: document.getElementById("imgs"),
  duration: 1000,
  easing: "linear",
  delay: 0,
  begin: function () {
    // triggered before the animation begins
  },
  update: function () {
    // triggered when each rAF is called
  },
  complete: function () {
    // triggered after the animation ends
  },
  // properties to be changed in targets
  opacity: 1,
}).play();
```

### Timeline

```javascript
anime().timeline().add({
    targets: particules,
    duration: anime.random(1200, 1800),
    easing: "easeOutExpo",
    update: renderParticule,
    x: function (p) {
      return p.endPos.x;
    },
    y: function (p) {
      return p.endPos.y;
    },
    radius: 0.1,
  })
  .add({
    targets: circle,
    duration: anime.random(1200, 1800),
    easing: "easeOutExpo",
    update: renderParticule,
    radius: anime.random(80, 160),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: "linear",
      duration: anime.random(600, 800),
    },
  }).play();
```

### More Examples

```javascript
anime({
  // support DOM
  // targets: document.getElementById("imgs"),
  // support plain object
  targets: { x: 1, y: 2 },
  // support array
  // targets: [{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 4}]

  // support Infinity duration
  duration: Infinity,

  // support lots of easing
  // easing: "linear",
  // easing: "easeOutExpo",
  // easing: "easeInQuad",
  // ...

  // properties to be changed in targets
  // support from-to mode
  x: [10, 20],
  // support keyframe mode
  x: [
    { value: 10, duration: 200 },
    { value: 20, duration: 400 },
  ],
  // support function
  y: function (item) {
    return item.x;
  },
  // support nest
  x: {
    value: 20, // required
    duration: 200, // required
    easing: "linear",
  },
  // support percentage and px
  // x: '100%',
  // x: '20px',
  // x: ['0%', '100%'],
  //
}).play();
```

### Default Options

```js
const defaultOptions = {
  targets: null,
  duration: Infinity,
  easing: "linear",
  delay: 0,
  begin: null,
  update: null,
  complete: null,
};
```
