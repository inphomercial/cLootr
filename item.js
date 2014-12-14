
Game.Item = function(args) {
	args = args || {};

	// Call the glyphs constructor with our set of props
	Game.Glyph.call(this, args);

	// Instantiate any args from the passed object
	this._name = args['name'] || '';
};

// Make items inhert all the functionality from glyphs
Game.Item.extend(Game.Glyph);

Game.Item.prototype.describe = function() {
	return this._name;
};

Game.Item.prototype.describeA = function(capitalize) {
	// Optional paramter to capitalize the a/an.
	var prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
	var string = this.describe();
	var firstLetter = string.charAt(0).toLowerCase();

	// if word stars by a vowel, use an, else use a. not perfect
	var prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0;

	return prefixes[prefix] + ' ' + string;
}
