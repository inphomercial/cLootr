
Game.Tile = function(args) {
	args = args || {};

	// Call the Glyph constructor with our properties
	Game.Glyph.call(this, args);

	// Setup the args. use false by default
	this._isWalkable = args.isWalkable || false;
	this._isDiggable = args.isDiggable || false;
};

// Make tiles inherit all the functionality from Glyphs
Game.Tile.extend(Game.Glyph);

Game.getNeighborsPosition = function(x, y) {
    var tiles = [];

    // Generate all possible offsets
    for(var dX=-1; dX<2; dX++) {
        for(var dY=-1; dY<2; dY++) {
            // Make sure isnt same tile
            if( dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }

    return tiles.randomize();
}

Game.Tile.prototype.isWalkable = function() {
	return this._isWalkable;
}

Game.Tile.prototype.isDiggable = function() {
	return this._isDiggable;
}

Game.Tile.nullTile = new Game.Tile({});

Game.Tile.floorTile = new Game.Tile({
	character: '.',
	isWalkable: true
});

Game.Tile.wallTile = new Game.Tile({
	character: '#',
	foreground: 'goldenrod',
	isDiggable: true
});

Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    forground: 'white',
    isWalkable: true
});

Game.Tile.staisDownTile = new Game.Tile({
    character: '>',
    forground: 'white',
    isWalkable: true
});
