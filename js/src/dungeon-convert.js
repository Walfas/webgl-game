define(["dungeon"], function(dungeon) {
	return function(tileDim, roomDim, roomMinSize) {
		var d = new dungeon.dungeon(tileDim,roomDim,roomMinSize);
		var cubes = [];
		var upStairs = [0,0,0];
		var downStairs = [0,0,0];

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
						upStairs = [x,y,z];
						break;
					case d.tileVals.down:
						cubes[z][y][x] = getDown(z); 
						downStairs = [x,y,z];
						break;
					}
				}
			}
		}
		return {
			cubes: cubes,
			upStairs: upStairs,
			downStairs: downStairs
		};

		function getWall(z) {
			if (z > 0)
				return 3;
			return 0;
		}
		function getFloor(z) {
			if (z > 0)
				return 0;
			return 3;
		}
		function getUp(z) {
			if (z > 0)
				return 0;
			return 4;
		}
		function getDown(z) {
			if (z > 0)
				return 0;
			return 4;
		}
	}
});

