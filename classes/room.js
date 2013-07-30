var Object = require('./gameObject.js');

var _roomList = [];
var _roomListNeedsUpdate = false;
var _nextRoomId = 1;

function Room(name) {
	this.id = _nextRoomId++;
	this.name = name;
	this.playerList = [];
	this.objectList = [];
	this.dice = 1;

	var objIndex = 0;
	
	for (var side = 0; side < 4; side++) {
		var color = 0xffffff;
		var baseHomefieldX = 85;
		var baseHomefieldY = 85;
		switch (side) {
			case 0: color = 0x000000; 
					baseHomefieldY = 850;
					break; //Black
			case 1: color = 0xff0000; 
					baseHomefieldX = 850;
					baseHomefieldY = 850;
					break; //Red							
			case 2: color = 0x00ff00; 
					baseHomefieldX = 850;
					break; //Green
			case 3: color = 0xffff00; 
					break; //Yellow
		}	
		for ( var i = 0; i < 4; i ++ ) {
			var homeX = 0;
			var homeY = 0;
			switch (i) {
				case 0: break;
				case 1: homeY = 90; break; //Red							
				case 2: homeX = 90; break; //Green
				case 3: homeX = 90;homeY = 90; break; //Yellow
			}
			var obj = new Object(objIndex++);
			obj.position[0] = baseHomefieldX + homeX - 512;
			obj.position[1] = baseHomefieldY + homeY - 512;
			obj.color = color;
			this.objectList.push(obj);
		}
	}
	
	this.needsPlayerListUpdate = false;
	this.needsObjectListUpdate = true;
	_roomList.push(this);
	_roomListNeedsUpdate = true;	
};

var p = Room.prototype;

p.getId = function() {
	return this.id;
}

p.getNetworkObject = function() {
	var result = {
		id : this.id,
		name : this.name,
		playerCount: this.playerList.length,
		playerMaxCount: 4
	}
	return result;
}

p.getFullNetworkObject = function() {
	var result = {
		id : this.id,
		name : this.name,
		dice : this.dice,
		playerList : this.getFullPlayerListObject(),
		objectList : this.getFullObjectListObject()
	}
	return result;
}

p.getFullPlayerListObject = function() {
	var result = [];
	var length = this.playerList.length;
	for (var i = 0;i < length;i++) {
		result.push(this.playerList[i].getNetworkObject());
	}
	return result;
}

p.getFullObjectListObject = function() {
	var result = [];
	var length = this.objectList.length;
	for (var i = 0;i < length;i++) {
		result.push(this.objectList[i].getNetworkObject());
	}	
	return result;
}


p.rollDice = function() {
	var self = this;
	var counter = 20;
	var length = this.playerList.length;
	var diceRoller = setInterval(function() {
		counter--;
		var dice = Math.floor(Math.random() * 6) + 1;
		if (counter <= 0) {
			clearInterval(diceRoller);
			self.dice = dice;
			for (var i = 0;i < length;i++) {
				self.playerList[i].socket.emit('dice', dice);
			}			
		} else {
			for (var i = 0;i < length;i++) {
				self.playerList[i].socket.volatile.emit('dice', dice);
			}				
		}
	}, 50);	
}

p.sendMessage = function(message) {
	var length = this.playerList.length;
	for (var i = 0; i < length; i++) {
		this.playerList[i].socket.emit("message",message);
	}
}

p.moveObject = function(id,x,y,z) {
	if (this.objectList[id]) {
		this.objectList[id].setPosition(x,y,z);
	}
}

p.connectPlayer = function(player) {
	if (this.playerList.length >= 4) {
		player.socket.emit("error","Max number of player reached");
		return;
	}
	
	if (player.room) {
		player.room.disconnectPlayer(player);
	}
	
	player.room = this;
	player.color = this.getFreeColor();
	this.sendMessage(" *** "+player.name+" joined the game");
	this.playerList.push(player);
	this.needsPlayerListUpdate = true;
	_roomListNeedsUpdate = true;
	player.socket.emit("fullRoomInfo",this.getFullNetworkObject());
}

p.getFreeColor = function() {
	var length = this.playerList.length;
	var color = 0xffffff;
	var possible = [0xffff00,0xff0000,0x000000,0x00ff00];
	for (var i = 0;i < length;i++) {
		if (this.playerList[i].color == 0xffff00) {
			possible[0] = false;
		} else
		if (this.playerList[i].color == 0xff0000) {
			possible[1] = false;
		} else
		if (this.playerList[i].color == 0x000000) {
			possible[2] = false;
		} else
		if (this.playerList[i].color == 0x00ff00) {
			possible[3] = false;
		} 
			
	}
	for (var i = 0;i < 4;i++) {
		if (possible[i] !== false) {
			color = possible[i];
			break;
		}
	}
	return color;
}

p.disconnectPlayer = function(player) {
	var index = this.playerList.indexOf(player);
	if (index != -1) {
		this.playerList.splice(index, 1);
	}	
	this.needsPlayerListUpdate = true;
	_roomListNeedsUpdate = true;
	if (this.playerList.length == 0) {
		this.closeRoom();
	} else {
		this.sendMessage(" *** "+player.name+" left the game");
	}
}

p.closeRoom = function() {		
	//Disconnect all player!
	var length = this.playerList.length;
	for (var i = 0; i < length; i++) {
		this.playerList[i].room = null;
		this.playerList[i].socket.emit("you",this.playerList[i].getNetworkObject());
	}
	this.playerList = [];
	
	var index = _roomList.indexOf(this);
	if (index != -1) {
		_roomList.splice(index, 1);
	}
	_roomListNeedsUpdate = true;
}
	
module.exports = Room;



p.static_getOverviewList = function() {
	var result = [];
	var length = _roomList.length;
	for (var i = 0; i < length; i++) {
		result.push(_roomList[i].getNetworkObject());
	}
	return result;
}

p.static_getRoomList = function() {
	return _roomList;
}

p.static_roomListNeedsUpdate = function() {
	return _roomListNeedsUpdate;
}

p.static_roomListUpdated = function() {
	_roomListNeedsUpdate = false;
}  

p.static_getRoomWithId = function(id) {
	var length = _roomList.length;
	for (var i = 0; i < length; i++) {
		if (_roomList[i].id == id) {
			return _roomList[i];
		}
	}
	return null;
}