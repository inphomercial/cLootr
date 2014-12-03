
Game.Entity = function(args) {
	args = args || {};

	// Call the Glyphs constructor
	Game.Glyph.call(this, args);

	// Instantiate args 
	this._name = args.name || "";
	this._x = args.x || 0;
	this._y = args.y || 0;
	this._z = args.z || 0;
	this._map = null;

	// Create an object which will keep track of mixins
	// attached to this entity based on the name property
	this._addedMixins = {};
	this._addedMixinGroups = {};

	// Setup the objects mixins
	var mixins = args.mixins || [];
	for(var i=0; i<mixins.length; i++) {
		// copy over all properties from each mixin as long
		// as it's not the name or the init property.
		// we also make sure not to override a property that
		// already exists on the entity
		for(var key in mixins[i]) {
			if(key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
				this[key] = mixins[i][key];
			}
		}
		// Add the name of this mixin to our added mixins
		this._addedMixins[mixins[i].name] = true;

		// if a group name is present, add it
		if(mixins[i].groupName) {
			this._addedMixinGroups[mixins[i].groupName] = true;
		}

		// call the inti function if there is one for the mixin
		if(mixins[i].init) {
			mixins[i].init.call(this, args);
		}
	}
}

// Make all entities inherit all form glyph
Game.Entity.extend(Game.Glyph);

// Allows passing the mixin or the name / group name as a string
Game.Entity.prototype.hasMixin = function(mixin) {
	if(typeof mixin === 'object') {
		return this._addedMixins[mixin.name];
	} else {
		return this._addedMixins[mixin] || this._addedMixinGroups[mixin];
	}
}

Game.Entity.prototype.setName = function(name) {
	this._name = name;
}

Game.Entity.prototype.setPosition = function(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
}

Game.Entity.prototype.setX = function(x) {
	this._x	= x;
}

Game.Entity.prototype.setY = function(y) {
	this._y	= y;
}

Game.Entity.prototype.setZ = function(z) {
    this._z = z;
}

Game.Entity.prototype.getZ = function() {
    return this._z;
}

Game.Entity.prototype.getName = function() {
	return this._name;
}

Game.Entity.prototype.getX = function() {
	return this._x;
}

Game.Entity.prototype.getY = function() {
	return this._y;
}

Game.Entity.prototype.setMap = function(map) {
	this._map = map;
}

Game.Entity.prototype.getMap = function() {
	return this._map;
}
