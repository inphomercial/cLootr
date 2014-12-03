
Game.Map = function(tiles, player) {
	this._tiles = tiles;

	// cache the width and heigth
	// based on length of dimensions
	// of tiles array
	this._width = tiles[0].length;
	this._height = tiles[0][0].length;
    this._depth = tiles.length;

	// Create a list which will hold all entities
	this._entities = [];
	// Create the entine and scheduler
	this._scheduler = new ROT.Scheduler.Simple();
	this._engine = new ROT.Engine(this._scheduler);

	// Add the player
	this.addEntityAtRandomPosition(player);
	// Add random fungi
	for(var i=0; i<500; i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.FungusTemplate));
	}
};

Game.Map.prototype.isEmptyFloor = function(x, y) {
	// check if the tile is a flor & if there is no entity
	return this.getTile(x, y) == Game.Tile.floorTile &&
		   !this.getEntityAt(x, y);
}

Game.Map.prototype.removeEntity = function(entity) {
	// Find the entity int he list of entities if it's present
	for(var i=0; i<this._entities.length; i++) {
		if(this._entities[i] == entity) {
			this._entities.splice(i, 1);
			break;
		}
	}

	// If the entity is an actor, remove them from the scheduler
	if(entity.hasMixin('Actor')) {
		this._scheduler.remove(entity);
	}
}

Game.Map.prototype.addEntity = function(entity) {
	// Make sure the entities position is within bounds
	if (entity.getX() < 0 || entity.getX() > this._width ||
		entity.getY() < 0 || entity.getY() > this._height) {
		throw new Error('Adding entity out of bounds');
	}

	// Update the entities map
	entity.setMap(this);

	// Add the entity to the list of entities
	this._entities.push(entity);

	// check if this entity is an actor, if so add them to scheduler
	if(entity.hasMixin('Actor')) {
		this._scheduler.add(entity, true);
	}
}

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
	var results = [];

	// Determine bounds
	var leftX = centerX - radius;
	var rightX = centerX + radius;
	var topY = centerY - radius;
	var bottomY = centerY + radius;

	// Iterate through our entities adding any which are within bounds.
	for(var i=0; i<this._entities.length; i++) {
		if(this._entities[i].getX() >= leftX &&
		   this._entities[i].getX() <= rightX &&
		   this._entities[i].getY() >= topY &&
		   this._entities[i].getY() <= bottomY) {
			results.push(this._entities[i]);
		}
	}

	return results;
}

Game.Map.prototype.addEntityAtRandomPosition = function(entity) {
	var pos = this.getRandomFloorPosition();
	entity.setX(pos.x);
	entity.setY(pos.y);
	this.addEntity(entity);
}

Game.Map.prototype.getWidth = function() {
	return this._width;
};

Game.Map.prototype.getHeight = function() {
	return this._height;
};

// Gets the tile for a given cord
Game.Map.prototype.getTile = function(x, y) {
	// make sure we are inside the bounds, else return null tile
	if(x < 0 || x >= this._width || y < 0 || y >= this._height) {
		return Game.Tile.nullTile;
	} else {
		return this._tiles[x][y] || Game.Tiles.nullTile;
	}
};

Game.Map.prototype.getDepth = function() {
    return this._depth;
}

Game.Map.prototype.dig = function(x, y) {
	// if the tile is diggable, update it to a floor tile
	if(this.getTile(x, y).isDiggable()) {
		this._tiles[x][y] = Game.Tile.floorTile;
	}
}

// Randomly generate a tile which is a floor
Game.Map.prototype.getRandomFloorPosition = function() {
	var x, y;
	do {
		x = Math.floor(Math.random() * this._width);
		y = Math.floor(Math.random() * this._height);
	} while(!this.isEmptyFloor(x, y));

	return {x: x, y: y};
}

Game.Map.prototype.getEngine = function() {
	return this._engine;
}

Game.Map.prototype.getEntities = function() {
	return this._entities;
}

Game.Map.prototype.getEntityAt = function(x, y) {
	// iterate over all entities searching for one with matching pos
	for(var i=0; i<this._entities.length; i++) {
		if(this._entities[i].getX() == x && this._entities[i].getY() == y) {
			return this._entities[i];
		}
	}

	return false;
}
