require(["dungeon"], function(dungeon) {
	return function(tileDim, roomDim, roomMinSize) {
		var d = new dungeon(tileDim,roomDim,roomMinSize);
		d.printDungeon();
		console.log(d);
		var cubes = [];

		for (var z=0; z<2; z++) {
			cubes[z] = [];
			for (var y=0; y<d.tileDim[1]; y++) {
				cubes[z][y] = [];
				for (var x=0; x<d.tileDim[0]; x++) {
					switch(dungeon.tiles[x][y]) {
					case dungeon.tileVals.empty:
						cubes[z][y][x] = 0; break;
					case dungeon.tileVals.wall:
						cubes[z][y][x] = getWall(z); break;
					case dungeon.tileVals.floor:
						cubes[z][y][x] = getFloor(z); break;
					case dungeon.tileVals.up:
						cubes[z][y][x] = getUp(z); break;
					case dungeon.tileVals.down:
						cubes[z][y][x] = getDown(z); break;
					}
				}
			}
		}
		return cubes;

		function getWall(z) {
			if (z == 0)
				return 0;
			return 3;
		}
		function getFloor(z) {
			if (z > 0)
				return 0;
			return 3;
		}
		function getUp(z) {
			return 4;
		}
		function getDown(z) {
			return 4;
		}
		}
});

