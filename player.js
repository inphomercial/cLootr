
Game.PlayerTemplate = {
	character: '@',
	foreground: 'yellow',
	background: 'black',
	maxHp: 40,
	attackValue: 10,
	mixins: [Game.Mixins.Moveable, 
			 Game.Mixins.PlayerActor, 
			 Game.Mixins.Attacker,
			 Game.Mixins.Destructible,
			 Game.Mixins.MessageRecipient]
}


Game.FungusTemplate = {
	name: 'fungus',
	character: 'f',
	foreground: 'green',
	maxHp: 10,
	mixins: [Game.Mixins.FungusActor,
			 Game.Mixins.Destructible]
}
