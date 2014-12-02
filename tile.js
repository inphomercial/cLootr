
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
