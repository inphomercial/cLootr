
Game.Mixins = {};

// Moveable component
Game.Mixins.Moveable = {
	name: 'Moveable',
	tryMove: function(x, y, map) {
		var tile = map.getTile(x, y);
		var target = map.getEntityAt(x, y);

		// If an entity was present at the tile
		// then we cannot move there
		if(target) {
			//if we are an attack, try to attack
			if(this.hasMixin('Attacker')) {
				this.attack(target);
				return true;
			} else {
				// if not, nothing we can do, but cant move tot he tile
				return false;
			}
		}

		// Check if we can walk on the tile
		if(tile.isWalkable()) {
			// update entity pos
			this._x = x;
			this._y = y;
			return true;
		// Check if tile is diggable
		} else if (tile.isDiggable()) {
			map.dig(x, y);
			return true;
		}

		return false;
	}
}

Game.Mixins.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	act: function() {
		// re-render the screen
        Game.refresh();
		// Lock the engine and wait async for player to press a key
		this.getMap().getEngine().lock();
		// Clear the message queue
		this.clearMessages();
	}
}

Game.Mixins.FungusActor = {
	name: 'FungusActor',
	groupName: 'Actor',
	init: function () {
		this._growthsRemaining = 5;
	},
	act: function() {
		if (this._growthsRemaining <= 0 || Math.random() > 0.02) {
            return;
        }

        // Generate the coordinates of a random adjacent square by
        // generating an offset between [-1, 0, 1] for both the x and
        // y directions. To do this, we generate a number from 0-2 and then
        // subtract 1.
        var xOffset = Math.floor(Math.random() * 3) - 1;
        var yOffset = Math.floor(Math.random() * 3) - 1;
 
        // Make sure we aren't trying to spawn on the same tile as us
        if (xOffset == 0 && yOffset == 0) {
            return;
        }
 
        var xLoc = this.getX() + xOffset;
        var yLoc = this.getY() + yOffset;
 
        // Check if we can actually spawn at that location, and if so
        // then we grow!
        if (!this.getMap().isEmptyFloor(xLoc, yLoc)) {
            return;
        }
 
        var entity = new Game.Entity(Game.FungusTemplate);
        entity.setX(xLoc);
        entity.setY(yLoc);
        this.getMap().addEntity(entity);
        this._growthsRemaining--;

        // Send a message nearby!
        Game.sendMessageNearby(this.getMap(),
            entity.getX(), entity.getY(),
            'The fungus is spreading!');
	}
}

Game.Mixins.MessageRecipient = {
	name: 'MessageRecipient',
	init: function(template) {
		this._messages = [];
	},
	receiveMessage: function(message) {
		this._messages.push(message);
	},
	getMessages: function() {
		return this._messages;
	},
	clearMessages: function() {
		this._messages = [];
	}
}

Game.Mixins.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',
	init: function(template) {
		this._attackValue = template.attackValue || 1;
	},
	getAttackValue: function() {
		return this._attackValue;
	},
	attack: function(target) {
		// only remove the entity if they were attackable
		if(target.hasMixin('Destructible')) {

			// calculate damage based on attack and def
			var atk = this.getAttackValue();
			var def = target.getDefenseValue();
			var max = Math.max(0, atk - def);
			var damage = 1 + Math.floor(Math.random() * max);

			Game.sendMessage(this, 'You strike the %s for %d damage!', 
                [target.getName(), damage]);
            Game.sendMessage(target, 'The %s strikes you for %d damage!', 
                [this.getName(), damage]);

			target.takeDamage(this, damage);
		}
	}
}

Game.Mixins.Destructible = {
	name: 'Destructible',
	init: function(template) {
		this._maxHp = template.maxHp || 10;		
		this._hp = template.hp || this._maxHp;

		// defensive value
		this._defenseValue = template.defensive || 0;
	},
	getDefenseValue: function(){
		return this._defenseValue;
	},
	getHp: function() {
		return this._hp;
	},
	getMaxHp: function() {
		return this._maxHp;
	},
	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		// if 0 or less, remove from map
		if(this._hp <= 0) {
			Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            Game.sendMessage(this, 'You die!');
			this.getMap().removeEntity(this);
		}
	}
}
