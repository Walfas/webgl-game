define(["dungeon","levels"], function(dungeon,levels) {
	return function(level) {
		var cubes = [];
		var upstairs = [0,0,0];
		var downstairs = [0,0,0];
		var tileDim = level.tileDim;
		var roomDim = level.roomDim;
		var roomMinSize = level.roomMinSize;
		var d = new dungeon.dungeon(tileDim,roomDim,roomMinSize);

		for (var z=0; z<2; z++) {
			cubes[z] = [];
			for (var y=0; y<d.tileDim[1]; y++) {
				cubes[z][y] = [];
				for (var x=0; x<d.tileDim[0]; x++) {
					switch(d.tiles[x][y]) {
					case d.tileVals.empty:
						cubes[z][y][x] = 0; break;
					case d.tileVals.wall:
						cubes[z][y][x] = getWall(z); break;
					case d.tileVals.floor:
						cubes[z][y][x] = getFloor(z); break;
					case d.tileVals.up:
						cubes[z][y][x] = getUp(z); 
						upstairs = [x,y,1.2];
						break;
					case d.tileVals.down:
						cubes[z][y][x] = getDown(z); 
						downstairs = [x,y,1.2];
						break;
					}
				}
			}
		}
		return {
			cubes: cubes,
			upstairs: upstairs,
			downstairs: downstairs
		};

		function randFromArray(arr) {
			return arr[Math.floor(Math.random()*arr.length)];
		}

		function getWall(z) {
			if (z == 0)
				return 0;
			return randFromArray(level.wallTiles);
		}
		function getFloor(z) {
			if (z > 0)
				return 0;
			return randFromArray(level.floorTiles);
		}
		function getUp(z) {
			if (z > 0)
				return 0;
			return 212;
		}
		function getDown(z) {
			if (z > 0)
				return 0;
			return 211;
		}
	}
});

