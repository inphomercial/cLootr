var Game = {
	_display: null,
	_currentScreen: null,
	_screenWidth: 80,
	_screenHeight: 24,

	init: function() {
		// all init goes here

		this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight + 1});

		// Create a helper function for binding to an event
		// and making it send it to the screen
		var game = this; // dont wanna lose it
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				// when an event is received, send it to the screen
				// if there is one
				if(!game._currentScreen !== null) {
					// send the event type and data to the screen
					game._currentScreen.handleInput(event, e);
				}
			});
		}

		// Bind keyboard input events
		bindEventToScreen('keydown');
		bindEventToScreen('keyup');
		bindEventToScreen('keypress');
	},
	refresh: function() {
		// Clear the Screen
		this._display.clear();

		// ReRender the screen
		this._currentScreen.render(this._display);
	},
	getDisplay: function() {
		return this._display;
	},
	getScreenWidth: function() {
		return this._screenWidth;
	},
	getScreenHeight: function() {
		return this._screenHeight;
	},
	switchScreen: function(screen) {
		// if we already had a screen, tell it to exit
		if(this._currentScreen !== null) {
			this._currentScreen.exit();
		}

		// clear the display
		this.getDisplay().clear();

		// Update our current screen, notify it we entered and then render it
		this._currentScreen = screen;
		if(!this._currentScreen !== null) {
			this._currentScreen.enter();
			this.refresh();
		}
	}
}

Game.sendMessage = function(recipient, message, args) {
	// make sure the recipient can receive the message
	if(recipient.hasMixin(Game.Mixins.MessageRecipient)) {
		// If args were passed, then we format the message, else no forrmatting
		if(args) {
			message = vsprintf(message, args);
		}
		recipient.receiveMessage(message);
	}
}

Game.sendMessageNearby = function(map, centerX, centerY, message, args) {
	// if args were passed, we need to formage
	if(args) {
		message = vsprintf(message, args);
	}

	// Get the nearby entities
	entities = map.getEntitiesWithinRadius(centerX, centerY, 5);

	// iterate nearby entities sending the message if they can recieve it
	for(var i=0; i<entities.length; i++) {
		if(entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
			entities[i].receiveMessage(message);	
		}
	}
}

window.onload = function() {

	if(!ROT.isSupported()) {
		alert("The rot.js library is not supported");
	} else {
		// Initalize game
		Game.init();

		// Add the container to our html page
		document.body.appendChild(Game.getDisplay().getContainer());

		// Load the start screen
		Game.switchScreen(Game.Screen.startScreen);
	}

	
}
