var _playerList = [];
var _nextPlayerId = 1;

function Player(socket) {
	this.id = _nextPlayerId++;
	this.name = "";
	this.color = 0x000000;
	this.room = null; //Room = null => is in lobby
	this.position = [-512,-512];
	this.needsUpdate = false;
	this.needsPosUpdate = false;
	this.socket = socket;
  
	_playerList.push(this);

};
var p = Player.prototype;

p.getId = function() {
	return this.id;
}

p.getNetworkObject = function() {
	var result = {
		id : this.id,
		name : this.name,
		color : this.color,
		room : (this.room)?this.room.getId():-1,
		position : this.position
	}
	return result;
}

p.getCompressedNetworkObject = function() {
	var result = [
		this.color,
		this.position[0],
		this.position[1]
	];
	this.needsPosUpdate = false;
	return result;
}

p.setName = function(name) {
	this.name = name;
	this.needsUpdate = true;
}

p.setColor = function(color) {
	this.color = color;
	this.needsUpdate = true;	
}

p.setPosition = function(x,y) {
	this.position = [x,y];
	this.needsPosUpdate = true;	
}

p.rollDice = function() {
	if (this.room) {
		this.room.rollDice();
	}
}

p.sendMessage = function(message) {
	if (this.room) {
		var now = new Date();;
		var hour = now.getHours();
		var minute = now.getMinutes();
		if (hour < 10) hour = "0" + hour;
		if (minute < 10) minute = "0" + minute;
		this.room.sendMessage("[" + hour + ":" + minute + "] " + this.name + ": " + message);
	}
}

p.moveObject = function(id,x,y,z) {
	if (this.room) {
		this.room.moveObject(id,x,y,z);
	}	
}

p.disconnect = function() {		
	var index = _playerList.indexOf(this);
	if (index != -1) {
		_playerList.splice(index, 1);
	}
	if (this.room) {
		this.room.disconnectPlayer(this);
	}
	this.socket = null;
	this.room = null;
}

module.exports = Player;



p.static_getLobbyList = function() {
	var result = [];
	var length = _playerList.length;
	for (var i = 0;i < length;i++) {
		if (!_playerList[i].room) {
			result.push(_playerList[i]);
		}
	}
	return result;
}

p.static_getPlayerWithId = function(id) {
	var length = _playerList.length;
	for (var i = 0; i < length; i++) {
		if (_playerList[i].id == id) {
			return _playerList[i];
		}
	}
	return null;
}	