

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    maxHp: 5,
    attackValue: 10,
    sightRadius: 6,
    inventorySlots: 22,
    mixins: [Game.Mixins.PlayerActor,
             Game.Mixins.Attacker, Game.Mixins.Destructible,
             Game.Mixins.Sight,    Game.Mixins.InventoryHolder,    
             Game.Mixins.MessageRecipient]
}

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);

// Fungus template
Game.EntityRepository.define('fungus', {
    name: 'fungus',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
});

Game.EntityRepository.define('bat', {
	name: 'bat',
	character: 'b',
	forground: 'white',
	maxHp: 5,
	attackValue: 4,
	mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker,
			 Game.Mixins.Destructible]
});

Game.EntityRepository.define('newt', {
	name: 'newt',
	character: ':',
	forground: 'yellow',
	maxHp: 3,
	attackValue: 2,
	mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker,
			 Game.Mixins.Destructible]
});
