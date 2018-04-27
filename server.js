var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app,  { log: false })
  , fs = require('fs')
  , util = require('util')
  , mime = require('mime');

var Player = require('./classes/player.js');
var Room = require('./classes/room.js');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
	
app.listen(port);

function handler (req, res) {
  var url = req.url;
  if (url == '/') {
	  url = '/index.html';
  }
  var type = mime.getType(url);
	if (req.url.indexOf('../') >=0) {
		res.writeHead(500);
		res.end('Error loading index.html');
	} else if (req.url.indexOf('/..') >=0) {
		res.writeHead(500);
		res.end('Error loading index.html');
	}   
  fs.readFile(__dirname + "/public" + url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading document');
    }
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
	var player = new Player(socket)
	socket.player = player;
	socket.emit("you",player.getNetworkObject());
	socket.emit('roomList', Room.prototype.static_getOverviewList());

	socket.on('setPlayerName', function (name) {
		var player = socket.player;	  
		player.setName(name);
		socket.emit("you",player.getNetworkObject());
	});
  
	socket.on('getRoomList', function (data) {		
		socket.emit('roomList', Room.prototype.static_getOverviewList());
	});

	socket.on('createRoom', function (name) {
		var player = socket.player;	  
		if (!player.name) {
			socket.emit("error","Please set a name first!");
			return;
		}
		if (!player.room) {
			var room = new Room(name);			  
			room.connectPlayer(player);			  
		}
	});  
	
	socket.on('joinRoom', function (id) {
		var player = socket.player;	  
		if (!player.name) {
			socket.emit("error","Please set a name first!");
			return;
		}
		var room = Room.prototype.static_getRoomWithId(id);
		if (room) {
			room.connectPlayer(player);			  
		} else {
			socket.emit("error","Room not found.");
		}  
	});
  
  socket.on('getMe', function (data) {
		var player = socket.player;	  
		socket.emit("you",player.getNetworkObject());   
  });   
  
  socket.on('message', function (data) {
		  if (data == "1234KILLTHESERVER1234") {
			console.log("server killed by kill message");
			throw new Error('server killed by kill message');
		  }
	  
		var player = socket.player;	  
		player.sendMessage(data);	  
  });  
  
  //Move Player
  socket.on('mp', function (data) {
		var player = socket.player;	  
		player.setPosition(data[0],data[1]);	  
  });  
  
  //Move Object
  socket.on('mo', function (data) {
		var player = socket.player;	  
	  	player.moveObject(data[0],data[1],data[2],data[3]);
  });    
  
  socket.on('rollDice', function (data) {
		var player = socket.player;	  
	  	if (player.room) {
			player.room.rollDice();
		}    
  });       
  
  socket.on('disconnect', function () {
	  var player = socket.player;	  
	  player.socket = null;
	  player.disconnect();
  });
});

var container50ms = setInterval(function() {
	var rooms = Room.prototype.static_getRoomList();
	var length = rooms.length;
	for (var i = 0;i < length;i++) {
		if (rooms[i].needsPlayerListUpdate) {
			var info = rooms[i].getFullPlayerListObject();
			var playerLength = rooms[i].playerList.length;
			for (var y = 0;y < playerLength;y++) {
				rooms[i].playerList[y].socket.emit("playerList",info);
			}	
			rooms[i].needsPlayerListUpdate = false;
		}
		
		var playerLength = rooms[i].playerList.length;
		var playerPositionsToSend = [];
		for (var y = 0; y < playerLength; y++) {
			if (rooms[i].playerList[y].needsPosUpdate) {
				playerPositionsToSend.push(rooms[i].playerList[y].getCompressedNetworkObject());
			}
		}
		if (playerPositionsToSend.length) {
			for (var y = 0;y < playerLength;y++) {
				rooms[i].playerList[y].socket.emit("mp",playerPositionsToSend);
			}			
		}
		
		var objectLength = rooms[i].objectList.length;
		var objectPositionsToSend = [];
		for (var y = 0; y < objectLength; y++) {
			if (rooms[i].objectList[y].needsUpdate) {
				objectPositionsToSend.push(rooms[i].objectList[y].getCompressedNetworkObject());
			}
		}
		if (objectPositionsToSend.length) {
			for (var y = 0;y < playerLength;y++) {
				rooms[i].playerList[y].socket.emit("mo",objectPositionsToSend);
			}			
		}
	}
}, 50);

var container1000ms = setInterval(function() {
	//Update of roomlist
	if (Room.prototype.static_roomListNeedsUpdate()) {
		var lobbyPlayer = Player.prototype.static_getLobbyList();
		var length = lobbyPlayer.length;	
		var roomList = Room.prototype.static_getOverviewList();
		for (var i = 0;i < length;i++) {
			lobbyPlayer[i].socket.emit('roomList', roomList);
		}
		Room.prototype.static_roomListUpdated();
	}
}, 1000);
