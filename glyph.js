
Game.Glyph = function(args) {
	// instantiate properties to default if they werent passed
	args = args || {};
	this._char = args.character || ' ';
	this._foreground = args.foreground || 'white';
	this._background = args.background || 'black';
};

// Getters
Game.Glyph.prototype.getChar = function() {
	return this._char;
}

Game.Glyph.prototype.getForeground = function() {
	return this._foreground;
}

Game.Glyph.prototype.getBackground = function() {
	return this._background;
}