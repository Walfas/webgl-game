define(function() {
var randInt = function(min,max) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random()*(max-min))+min;
};

var Room = (function() {
	var Room = function(id,minSize,maxSize,topLeft) {
		this.id = id;
		this.connected = false;
		this.unconnectedNeighbors = [];
		this.connectedTo = [];
		var size = [
			randInt(minSize[0],maxSize[0]),
			randInt(minSize[1],maxSize[1])
		];
		var positionMax = [
			maxSize[0] - size[0],
			maxSize[1] - size[1]
		];
		var position = [
			topLeft[0] + randInt(positionMax[0]) + 1,
			topLeft[1] + randInt(positionMax[1]) + 1
		];
		this.rect = [position[0],position[1],size[0],size[1]];
	};
	Room.prototype.removeFromUnconnected = function(roomId) {
		for (var i=0; i<this.unconnectedNeighbors.length; i++) {
			if (this.unconnectedNeighbors[i].id == roomId) {
				this.unconnectedNeighbors.splice(i,1);
				return;
			}
		}
	};
	Room.prototype.connectTo = function(roomIndex) {
		var newlyConnected = this.unconnectedNeighbors[roomIndex];
		this.connectedTo.push(newlyConnected);
		this.unconnectedNeighbors.splice(roomIndex,1);
		//newlyConnected.connectedTo.push(this);
		newlyConnected.removeFromUnconnected(this.id);
		this.connected = true;
		newlyConnected.connected = true;

		return newlyConnected;
	};
	Room.prototype.connectRandom = function() {
		if (this.unconnectedNeighbors.length == 0)
			return false;
		var roomIndex = randInt(this.unconnectedNeighbors.length);
		return this.connectTo(roomIndex);
	};
	Room.prototype.connectToConnected = function() {
		var candidates = [];
		for (var i=0; i<this.unconnectedNeighbors.length; i++)
			candidates.push(i);
		while (candidates.length > 0) {
			var index = randInt(candidates.length);
			if (this.unconnectedNeighbors[candidates[index]].connected) 
				return this.connectTo(candidates[index]);
			else
				candidates.splice(index,1);
		}
		return false;
	};
	return Room;
})();

	var Dungeon = function(tileDim, roomDim, roomMinSize) {
		this.tileDim = tileDim;
		this.roomDim = roomDim;
		this.numRooms = roomDim[0]*roomDim[1];
		this.roomGrid = [
			Math.floor(tileDim[0]/roomDim[0]),
			Math.floor(tileDim[1]/roomDim[1])
		];
		this.rooms = [];
		this.firstRoom = 0;
		this.lastRoom = 0;

		this.tileVals = {
			wall:  "#",
			floor: " ",
			empty: ".",
			up:    "u",
			down:  "d",
		}
		
		var tiles = [];
		for (var i=0; i<tileDim[0]; i++) {
			tiles[i] = [];
			for (var j=0; j<tileDim[1]; j++)
				tiles[i][j] = this.tileVals.wall;
		}
		this.tiles = tiles;
		
		var roomMaxSize = [
			tileDim[0]/roomDim[0]-2,
			tileDim[1]/roomDim[1]-2
		];
		if (!roomMinSize)
			roomMinSize = [2,2];
		var rooms = [];
		for (var i=0; i<roomDim[0]; i++) {
			rooms[i] = [];
			for (var j=0; j<roomDim[1]; j++)
				rooms[i][j] = new Room(
					i*roomDim[0]+j,
					roomMinSize,
					roomMaxSize, 
					[this.roomGrid[0]*i, this.roomGrid[1]*j]
				);
		}
		for (var i=0; i<roomDim[0]; i++) {
			for (var j=0; j<roomDim[1]; j++) {
				if (i>0)
					rooms[i][j].unconnectedNeighbors.push(rooms[i-1][j]);
				if (i<roomDim[0]-1)
					rooms[i][j].unconnectedNeighbors.push(rooms[i+1][j]);
				if (j>0)
					rooms[i][j].unconnectedNeighbors.push(rooms[i][j-1]);
				if (j<roomDim[1]-1)
					rooms[i][j].unconnectedNeighbors.push(rooms[i][j+1]);
			}
		}
		this.rooms = rooms;
		

		this.getRoomFromCoords = function(x,y) {
			return this.rooms[x*this.rooms.length][y];
		};

		this.getRoomFromId = function(id) {
			return this.rooms[Math.floor(id/this.roomDim[0])][id%this.roomDim[1]];
		};
		
		this.generate = function() {
			var unconnected = [];
			for (var i=0; i<this.numRooms; i++)
				unconnected[i] = i;

			// See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
			var roomId = randInt(this.numRooms);
			var current = this.getRoomFromId(roomId);
			var firstRoom = roomId;
			while (current && current.unconnectedNeighbors.length > 0) {
				roomId = current.id;
				var roomIndex = unconnected.indexOf(roomId);
				if (roomIndex >= 0)
					unconnected.splice(roomIndex,1);
				current = current.connectRandom();
			}
			while (unconnected.length > 0) {
				var roomNum = randInt(unconnected.length);
				current = this.getRoomFromId(unconnected[roomNum]);
				if (current.connectToConnected()) 
					unconnected.splice(roomNum,1);
			}
			var lastRoom = current.id;

			// Draw and connect rooms
			for (var i=0; i<this.numRooms; i++) {
				var room = this.getRoomFromId(i);
				this.fillRoom(room);
				for (var j=0; j<room.connectedTo.length; j++) {
					this.connectRooms(room,room.connectedTo[j]);
				}
			}

			// Place up stairs
			var room = this.getRoomFromId(firstRoom);
			this.upStairsPos = [
				room.rect[0] + randInt(room.rect[2]),
				room.rect[1] + randInt(room.rect[3]),
			];
			this.plot(this.upStairsPos[0],this.upStairsPos[1],this.tileVals.up);
			room = this.getRoomFromId(lastRoom);
			this.downStairsPos = [
				room.rect[0] + randInt(room.rect[2]),
				room.rect[1] + randInt(room.rect[3]),
			];
			this.plot(this.downStairsPos[0],this.downStairsPos[1],this.tileVals.down);
			this.cleanUpWalls();
		};

		this.plot = function(x,y,val) {
			if (!val)
				val = this.tileVals.floor;
			this.tiles[Math.floor(x)][Math.floor(y)] = val;
		};

		this.fillRoom = function(room) {
			for (var i=room.rect[0]; i<room.rect[0]+room.rect[2]; i++)
				for (var j=room.rect[1]; j<room.rect[1]+room.rect[3]; j++)
					this.plot(i,j);
		};

		// Bresenham's line algorithm
		// Thanks to: http://stackoverflow.com/a/4672319/1887090
		this.fillHallway = function(x0,y0,x1,y1) {
			var dx = Math.abs(x1-x0);
			var dy = Math.abs(y1-y0);
			var sx = (x0 < x1) ? 1 : -1;
			var sy = (y0 < y1) ? 1 : -1;
			var err = dx-dy;

			for(;;) {
				this.plot(x0,y0);

				if (x0==x1 && y0==y1) 
					break;

				var e2 = 2*err;
				if (e2 >-dy) { 
					err -= dy; 
					x0 += sx; 
					this.plot(x0,y0);
				}
				if (e2 < dx) { 
					err += dx; 
					y0 += sy; 
					this.plot(x0,y0);
				}
			}
		}

		this.connectRooms = function(room1,room2) {
			this.fillHallway(
				Math.floor(room1.rect[0] + room1.rect[2]/2),
				Math.floor(room1.rect[1] + room1.rect[3]/2),
				Math.floor(room2.rect[0] + room2.rect[2]/2),
				Math.floor(room2.rect[1] + room2.rect[3]/2)
			);
		};

		this.cleanUpWalls = function() {
			for (var i=0; i<this.tileDim[0]; i++) {
				for (var j=0; j<this.tileDim[1]; j++) {
					if (this.tiles[i][j] != this.tileVals.wall)
						continue;

					if (i>0 && this.isWalkable(i-1,j)
						|| i<this.tileDim[0]-1 && this.isWalkable(i+1,j)
						|| j>0 && this.isWalkable(i,j-1)
						|| j<this.tileDim[1]-1 && this.isWalkable(i,j+1)
					)
						continue;
					this.tiles[i][j] = this.tileVals.empty;
				}
			}
		}

		this.isWalkable = function(x,y) {
			return this.tiles[x][y] != this.tileVals.wall && this.tiles[x][y] != this.tileVals.empty;
		}

		this.printDungeon = function() {
			var str = "";
			for (var i=0; i<this.tileDim[0]; i++) {
				str += "\n";
				for (var j=0; j<this.tileDim[1]; j++)
					str += this.tiles[i][j];
			}
			console.log(str);
		}
		this.generate();
	};

	return { dungeon: Dungeon };
});
