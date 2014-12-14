
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

Game.Entity.prototype.tryMove = function(x, y, z, map) {
    var map = this.getMap();
    // Must use starting z
    var tile = map.getTile(x, y, this.getZ());
    var target = map.getEntityAt(x, y, this.getZ());
    // If our z level changed, check if we are on stair
    if (z < this.getZ()) {
        if (tile != Game.Tile.stairsUpTile) {
            Game.sendMessage(this, "You can't go up here!");
        } else {
            Game.sendMessage(this, "You ascend to level %d!", [z + 1]);
            this.setPosition(x, y, z);
        }
    } else if (z > this.getZ()) {
        if (tile != Game.Tile.stairsDownTile) {
            Game.sendMessage(this, "You can't go down here!");
        } else {
            this.setPosition(x, y, z);
            Game.sendMessage(this, "You descend to level %d!", [z + 1]);
        }
    // If an entity was present at the tile
    } else if (target) {
        // If we are an attacker, try to attack
        // the target
        if (this.hasMixin('Attacker') && (this.hasMixin(Game.Mixins.PlayerActor) || 
        	target.hasMixin(Game.Mixins.PlayerActor))) {
            this.attack(target);
            return true;
        }

        // If nothing we can do 
        return false;
    // Check if we can walk on the tile
    // and if so simply walk onto it
    } else if (tile.isWalkable()) {        
        // Update the entity's position
        this.setPosition(x, y, z);

        // Notify the entity that there are items at this position
        var items = this.getMap().getItemsAt(x, y, z)
    	if(items) {
    		if(items.length === 1) {
    			Game.sendMessage(this, "You see %s.", [items[0].describeA()]);	
    		} else {
    			Game.sendMessage(this, "There are serveral objects here.");
    		}
        }

        return true;
    // Check if the tile is diggable, and
    // if so try to dig it
    } else if (tile.isDiggable()) {

    	// only dig if the entity is the player
    	if(this.hasMixin(Game.Mixins.PlayerActor)) {
    		map.dig(x, y, z);
        	return true;	
    	}
    }
    return false;
};

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
	var oldX = this._x;
	var oldY = this._y;
	var oldZ = this._z;

	// Update position
    this._x = x;
    this._y = y;
    this._z = z;

    // If the entity is on a map, notify the map that the entity has moved
    if(this._map) {
    	this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
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
