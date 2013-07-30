function GameObject(id) {
  this.id = id;
  this.color = 0x000000;
  this.position = [0,0,0];
  this.needsUpdate = false;
};
var p = GameObject.prototype;

p.setPosition = function(x,y,z) {
	this.position = [x,y,z];
	this.needsUpdate = true;
}

p.getNetworkObject = function() {
	var result = {
		id : this.id,
		color : this.color,
		position : this.position
	}
	return result;
}

p.getCompressedNetworkObject = function() {
	var result = [
		this.id,
		this.position[0],
		this.position[1],
		this.position[2]
	]
	this.needsUpdate = false;
	return result;
}

module.exports = GameObject;