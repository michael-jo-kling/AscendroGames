var container, camera, controls, scene;
var plane, counterPlane, projector, renderer;

var currentPlayer = 0;
var objects = [];
var fields = [];
var playerObjects = [];

var mouse = new THREE.Vector2(),
			offset = new THREE.Vector3(),
			INTERSECTED, SELECTED;
		

function initField(player,room) {
		container = $('.gameField');
		
		var width = window.innerWidth;
		var height = window.innerHeight - $('.gameHeadline').height() - $('.gameFooter').height() - 50;
		
		camera = new THREE.PerspectiveCamera( 70, width / height, 1, 10000 );
		camera.position.z = 1000;
		
		controls = new THREE.OrbitControls( camera, container.get(0) );
		controls.userPanSpeed = 10;
		controls.rotateUp( 0.3 * Math.PI );
		
		currentPlayer = "c"+player.color;
		
		switch (player.color) {
			case 0x000000: controls.rotateRight(0);
					break; //Black
			case 0xff0000: controls.rotateRight( 0.5 * Math.PI );
					break; //Red							
			case 0x00ff00: controls.rotateRight( Math.PI );
					break; //Green
			case 0xffff00: controls.rotateRight( 1.5 * Math.PI );
					break; //Yellow		
		}
			
		scene = new THREE.Scene();
		scene.add( new THREE.AmbientLight( 0x505050 ) );
		
		var light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		light.castShadow = true;

		light.shadowCameraNear = 200;
		light.shadowCameraFar = camera.far;
		light.shadowCameraFov = 50;

		light.shadowBias = -0.00022;
		light.shadowDarkness = 0.5;

		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;

		scene.add( light );	
		
		var texture = THREE.ImageUtils.loadTexture( "img/field_compressed.png" );
		
		plane = new THREE.Mesh( new THREE.PlaneGeometry( 1024, 1024), new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } ) );
		plane.visible = true;
		plane.rotation.x = -0.5 * Math.PI;
		plane.castShadow = true;
		plane.receiveShadow = true;
		scene.add( plane );
		fields.push(plane);
		
		counterPlane = new THREE.Mesh( new THREE.PlaneGeometry( 1024, 1024), new THREE.MeshBasicMaterial( { color: 0x222222, map: texture } ) );
		counterPlane.visible = true;
		counterPlane.rotation.x = -0.5 * Math.PI + (Math.PI);
		scene.add( counterPlane );
		
		projector = new THREE.Projector();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.sortObjects = false;
		renderer.setSize( width, height );
		
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;
		
		container.append( renderer.domElement );
	
		var loader = new THREE.JSONLoader();
		loader.load( "js/objs/coneHead1d91ee66-c51c-454f-8c51-ccb83018db41.geo", function( geometryHead) {
			loader.load( "js/objs/coneBody615a0586-86fc-47ee-9338-e89593cbfc40.geo", function( geometry ) {
				var length = room.objectList.length;
				for (var i = 0;i < length;i++) {
					var objectHead = new THREE.Mesh( geometryHead, new THREE.MeshLambertMaterial( { color: room.objectList[i].color } ) );
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: room.objectList[i].color } ) );
					
					object.externalId = room.objectList[i].id;
					
					object.material.ambient = object.material.color;
					object.position.x = room.objectList[i].position[0];;
					object.position.z = room.objectList[i].position[1];;
					object.position.y = 25;
					
					object.scale.x = 0.5;
					object.scale.y = 0.5;
					object.scale.z = 0.5;
					
					object.castShadow = true;
					object.receiveShadow = true;

					objectHead.position.x = 0;
					objectHead.position.z = 0;
					objectHead.position.y = 65;
					
					objectHead.scale.x = 0.5;
					objectHead.scale.y = 0.5;
					objectHead.scale.z = 0.5;
					
					objectHead.castShadow = true;
					objectHead.receiveShadow = true;
					
					object.add( objectHead );
					scene.add( object );
					objects[room.objectList[i].id] = object;					
				}
				for (var side = 0; side < 4; side++) {
					var color = 0;
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
					
					var playerForMarker = null;
					var length = room.playerList.length;
					for (var i = 0;i < length;i++) {
						if (color == room.playerList[i].color) {
							playerForMarker = room.playerList[i];
							break;
						}
					}

					var playerObject = new THREE.Mesh( 						         
						new THREE.CylinderGeometry( 5, 5, 100, 6, 1, false ),  
						new THREE.MeshLambertMaterial( { color: color } ) 
					);
					playerObject.player = playerForMarker;
					playerObject.position.x = (playerForMarker)?playerForMarker.position[0]:-512;
					playerObject.position.z = (playerForMarker)?playerForMarker.position[1]:-512;
					playerObject.position.y = 50;
					playerObject.castShadow = false;
					playerObject.receiveShadow = false;
					if (!playerForMarker) {
						playerObject.visible = false;
					}
					
					playerObjects["c"+color] = playerObject;
					
					scene.add(playerObject);

				}
			} );
		} );
		
		
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );		
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		window.addEventListener( 'resize', onWindowResize, false );
		
	}

	function updatePlayerOnField(playerList) {
		for (var side = 0; side < 4; side++) {
			var color = 0;
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
			if (playerObjects["c"+color]) {
				var playerForMarker = null;
				var length = room.playerList.length;
				for (var i = 0;i < length;i++) {
					if (color == room.playerList[i].color) {
						playerForMarker = room.playerList[i];
						break;
					}
				}
							
				if (!playerForMarker) {
					playerObjects["c"+color].visible = false;
				} else {
					playerObjects["c"+color].visible = true;
				}		
			}			
		}		
	}
	
	function updateMarker(color,x,y) {
		playerObjects["c"+color].position.x = x;
		playerObjects["c"+color].position.z = y;
	}
	
	function updateObject(id,x,y,z) {
		if (objects[id]) {
			objects[id].position.x = x;
			objects[id].position.z = y;
			objects[id].position.y = z;
		}
	}

	
	function onWindowResize() {
		var width = window.innerWidth;
		var height = window.innerHeight - $('.gameHeadline').height() - $('.gameFooter').height() - 50;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );
	}
	

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		
		var width = window.innerWidth;
		var height = window.innerHeight- $('.gameFooter').height();
		mouse.x = ( event.clientX / width ) * 2 - 1;
		mouse.y = - ( event.clientY / height ) * 2 + 1;
		
		var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
		projector.unprojectVector( vector, camera );
		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( fields );
		if (intersects.length > 0) {
			playerObjects[currentPlayer].position.x = intersects[0].point.x;
			playerObjects[currentPlayer].position.z = intersects[0].point.z;
			if (socket) {
				socket.emit("mp",[intersects[0].point.x,intersects[0].point.z]);
			}
		}

		if ( SELECTED ) {
			if (intersects.length > 0) {
				SELECTED.position.x = intersects[0].point.x;
				SELECTED.position.z = intersects[0].point.z;
				if (socket) {
					socket.emit("mo",[SELECTED.externalId,SELECTED.position.x,SELECTED.position.z,SELECTED.position.y]);
				}
			}
			return;
		}

		var intersects = raycaster.intersectObjects( objects );
		if ( intersects.length > 0 ) {
			if ( INTERSECTED != intersects[ 0 ].object ) {
				if ( INTERSECTED ) {
					INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				}
				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			}
			container.css( 'cursor','pointer');
		} else {
			if ( INTERSECTED ) {
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			}
			INTERSECTED = null;
			container.css( 'cursor','auto');
		}
	}	
	
function onDocumentMouseDown( event ) {
		event.preventDefault();

		if ( INTERSECTED ) {
			controls.enabled = false;
			SELECTED = INTERSECTED;
			SELECTED.position.y = 45;
			if (socket) {
				socket.emit("mo",[SELECTED.externalId,SELECTED.position.x,SELECTED.position.z,SELECTED.position.y]);
			}
			container.css( 'cursor','move');
		}
	}

	
	function onDocumentMouseUp( event ) {
		event.preventDefault();

		controls.enabled = true;
		if ( INTERSECTED || SELECTED ) {
			if (SELECTED) {
				SELECTED.position.y = 25;
				if (socket) {
					socket.emit("mo",[SELECTED.externalId,SELECTED.position.x,SELECTED.position.z,SELECTED.position.y]);
				}
			}
			SELECTED = null;
		}
		container.css( 'cursor','auto');
	}
	
	var requestId;
	
	function animate() {
		requestId = requestAnimationFrame( animate );
		render();
	}
	
	function destroyAnimation() {
		cancelAnimationFrame( requestId );
		
		renderer.domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );		
		renderer.domElement.removeEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		window.removeEventListener( 'resize', onWindowResize, false );
		
		container.empty();
	}

	function render() {
		controls.update();
		renderer.render( scene, camera );
	}