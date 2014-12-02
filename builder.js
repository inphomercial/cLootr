
Game.Builder = function(width, height, depth) {
    this._width = width;
    this._height = height;
    this._depth = depth;
    this._tiles = new Array(depth);
    this._regions = new Array(depth);

    for (var z = 0; z < depth; z++) {
        // Create a new cave at each level
        this._tiles[z] = this._generateLevel();
        // Setup the regions array for each depth
        this._regions[z] = new Array(width);
        for (var x = 0; x < width; x++) {
            this._regions[z][x] = new Array(height);
            // Fill with zeroes
            for (var y = 0; y < height; y++) {
                this._regions[z][x][y] = 0;
            }
        }
    }
}

Game.Builder.prototype._canFillRegion = function(x, y, z) {
    // Make sure the tile is within bounds
    if (x < 0 || y < 0 || z < 0 || x >= this._width || y >= this._height || z >= this._depth) {
         return false;
    }

    // Make sure tile doesnt already have a region
    if(this._regions[x][y][z] != 0) {
        return false;
    }

    // Make sure tile isWalkable
    return this._regions[x][y][z].isWalkable();
}

Game.Builder.prototype._fillRegion = function(region, x, y, z) {
    var tilesFilled = 1;
    var tiles = [{x: x, y:y}];
    var tile;
    var neighbors;

    // Update the region of the original tile
    this._regions[x][y][z] = region;

    // Keep looping while we still have tiles to process
    while(tiles.length > 0) {
        tile = tiles.pop();
        // Get the neighbors of the tile
        neighbors = Game.getNeighborsPosition(tile.x, tile.y);
        // Iterate over each neighbor, checking if we can use it to fill,
        // if so, update region and add it to our processing list
        while(neighbors.length > 0) {
            tile = neghbors.pop();
            if(this._canFillRegion(tile.x, tile.y, z)) {
                this._regions[z][tile.x][tile.y] = region;
                tiles.push(tile);
                tilesFilled++;
            }
        }
    }

    return tilesFilled;
}

// Will remove all tiles in a given region on a given depth level
// it fills the tiles with wall tiles
Game.Builder.prototype._removeRegion = function(region, z) {
    for (var x = 0; x < this._width; x++) {
        for (var y = 0; y < this._height; y++) {
            if (this._regions[z][x][y] == region) {
                // Clear the region and set the tile to a wall tile
                this._regions[z][x][y] = 0;
                this._tiles[z][x][y] = Game.Tile.wallTile;
            }
        }
    }
}

// This setups up regions for a given depth level
Game.Builder.prototype._setupRegions = function(z) {
    var region = 1;
    var tilesFilled;

    // Iterate over all tiles, looking for one that can be our start point
    for(var x=0; x<this._width; x++) {
        for(var y=0; y<this._height; y++) {
            if(this._canFillRegion(x, y, z)) {
                // Try to fill
                tilesFilled = this._fillRegion(region, x, y, z);
                // If it was to small, remove it
                if(tilesFilled < 20) {
                    this._removeRegion(region, z);
                } else {
                    region++;
                }
            }
        }
    }
}













Game.Builder.prototype._generateLevel = function() {
    // Create the empty map
    var map = new Array(this._width);
    for(var w=0; w<this._length; w++) {
        map[w] = new Array(this._height);
    }

    // Setup the cave generator
    var generator = new ROT.Map.Cellular(this._width, this._height);
    generator.randomize(0.5);

    // Iterate and smooth map
    var iterations = 3;
    for(var i=0; i<iterations; i++) {
        generator.create();
    }
    generator.create(function(x, y v) {
        if(v === 1) {
            map[x][y] = new Game.Tile.floorTile;
        } else {
            map[x][y] = new Game.Tile.wallTile;
        }
    });

    return map;
});
