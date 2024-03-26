# ICellMap

[![npm](https://img.shields.io/npm/v/@wingit/icellmap)](https://www.npmjs.com/package/@wingit/icellmap)
[![npm](https://img.shields.io/npm/dm/@wingit/icellmap)](https://www.npmjs.com/package/@wingit/icellmap)
[![GitHub](https://img.shields.io/github/license/eekelof/icellmap)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

Spatial Hash Grid that extends Map &amp; incrementally assigns IDs

## Features

- :heavy_check_mark: Elements are stored on a 2D grid
- :heavy_check_mark: Filter nearby elements
- :heavy_check_mark: Extends Map
- :heavy_check_mark: Incrementally assigns IDs
- :blue_square: Written in TypeScript

## Installation

#### Using npm
```bash
npm i @wingit/icellmap
```

#### Using bun
```bash
bun i @wingit/icellmap
```

## Usage
```javascript
import ICellMap from "@wingit/icellmap";

// create a ICellMap(width, height, cell size)
const units = new ICellMap(100, 100, 10);

// add a unit
// set id & hash to -1, it is used internally and gets reassigned when added
const unit = { id: -1, hash: -1, pos: {x: 0, y: 0}, name: "Bob" };
const id = units.add(unit);

console.log(id); // 0
console.log(unit.id); // 0

// delete a unit
units.delete(id);

// update a unit
unit.pos.x = 35;
units.update(unit);

// get cells in range
const cellsInRange = g.ig.units.query(pos, radius);
for (const cell of cellsInRange) {
    for (const u of cell){
        console.log(u);
    }
}
```

## License

MIT