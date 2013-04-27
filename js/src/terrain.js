define(["gl","texture"], function(gl,texture) {
	return {
		Terrain: function(textureAtlas) {
			this.textureAtlas = textureAtlas;
			this.cubes = [];
			this.vertices = [];
			this.normals = [];
			this.texCoords = [];
			this.indices = [];
			this.baseIndex = 0;
			this.vertexObject = gl.createBuffer();
			this.normalObject = gl.createBuffer();
			this.texCoordObject = gl.createBuffer();
			this.indexObject = gl.createBuffer();

			this.numVertices = function() { return this.indices.length; };
			
			this.generate = function(world) {
				this.cubes = world;
				// Test for hidden faces and add blocks
				for (var z=0; z<world.length; z++) {
					for (var y=0; y<world[z].length; y++) {
						for (var x=0; x<world[z][y].length; x++) {
							if (world[z][y][x] == 0)
								continue;
							var showFace = [true, true, true, true, true, true];
							if (x > 0)
								showFace[0] = !world[z][y][x-1];
							if (x < world[z][y].length-1)
								showFace[1] = !world[z][y][x+1];
							if (y > 0)
								showFace[2] = !world[z][y-1][x];
							if (y < world[z].length-1)
								showFace[3] = !world[z][y+1][x];
							if (z > 0)
								showFace[4] = !world[z-1][y][x];
							if (z < world.length-1)
								showFace[5] = !world[z+1][y][x];

							this.addBlock(world[z][y][x], [x,y,z], showFace);
						}
					}
				}

				// Initialize buffer data
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, this.normalObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexObject);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}

			/** Add block to terrain (modifies vertices, normals, texCoords) 
				tileNum: Specifies which tile to take from the texture atlas
				pos: [x,y,z] of where this block is located on the terrain
				faces: [left,right,bottom,top,back,front] booleans for whether
					or not the corresponding face will be shown
			*/
			this.addBlock = function(tileNum, pos, faces) {
				/*   6-------5
				    /|      /|
				   1-------0 |
				   | |     | |
				   | 7-----|-4
				   |/      |/
				   2-------3  */
				var c = [	// Cube
					[ 1.0,  1.0,  1.0],
					[ 0.0,  1.0,  1.0],
					[ 0.0,  0.0,  1.0],
					[ 1.0,  0.0,  1.0],
					[ 1.0,  0.0,  0.0],
					[ 1.0,  1.0,  0.0],
					[ 0.0,  1.0,  0.0],
					[ 0.0,  0.0,  0.0]
				];
				// Apply offsets to cubes
				for (var i=0; i<c.length; i++) {
					c[i][0] += pos[0];
					c[i][1] += pos[1];
					c[i][2] += pos[2];
				}

				// Normals
				var n = [
					[-1,  0,  0], // left
					[ 1,  0,  0], // right
					[ 0, -1,  0], // front
					[ 0,  1,  0], // back
					[ 0,  0, -1], // bottom
					[ 0,  0,  1]  // top
				];

				// Indices for vertices
				var indices = [
					[2, 1, 6, 7],
					[0, 3, 4, 5],
					[3, 2, 7, 4],
					[1, 0, 5, 6],
					[6, 5, 4, 7],
					[0, 1, 2, 3]
				];
				
				for (var f=0; f<6; f++) {
					if (!faces[f])
						continue;
					this.addFaceVertices(c, indices[f]);
					this.addFaceNormals(n[f]);
					this.addFaceTexCoords(tileNum,f);
				}
			}

			this.addFaceVertices = function(cube,indices) {
				for (var i=0; i<indices.length; i++)
					this.vertices = this.vertices.concat(cube[indices[i]]);
				this.indices.push(
					this.baseIndex, this.baseIndex+1, this.baseIndex+2,
					this.baseIndex, this.baseIndex+2, this.baseIndex+3
				);
				this.baseIndex += 4;
			}

			this.addFaceNormals = function(newNormal) {
				for (var i=0; i<4; i++) 
					this.normals = this.normals.concat(newNormal);
			}

			this.addFaceTexCoords = function(tileNum,faceNum) {
				if (this.specialTiles.hasOwnProperty(tileNum)) {
					var specialTile = this.specialTiles[tileNum];
					if (!Array.isArray(specialTile))
						tileNum = specialTile; // Reference to different tile
					switch(faceNum) {
					case 2: tileNum = specialTile[0]; break; // front
					case 4: tileNum = specialTile[3]; break; // under
					case 5: tileNum = specialTile[2]; break; // top
					default: tileNum = specialTile[1]; break; // side
					}
				}
				var st = this.textureAtlas.getST(tileNum);

				this.texCoords = this.texCoords.concat(
					st[2], st[1], 
					st[0], st[1], 
					st[0], st[3],
					st[2], st[3]
				);
			}

			this.specialTiles = {
				// [front,side,top,under]
				3: [3,3,0,2], // grass
				5: [5,5,6,6], 6: 5, // slab
				8: [8,8,9,10], 9: 8, 10: 8, // TNT
				20: [20,20,21,21], 21: 20, // wood oak
				43: [59,60,43,43], 59: 43, 60: 43, // workbench
				44: [44,45,62,62], 45: 44, 62: 44, // furnace unlit
				46: [46,45,62,62], // dispenser
				69: [70,70,69,71], 70: 69, 71: 69, // cactus
				74: [74,74,75,75], 75: 74, // jukebox
				77: [77,77,78,2], 78: 77, // mycelium
				// 82,98: wood door
				// 83,99: iron door
				102: [119,118,102,102], // pumpkin
				120: [120,118,102,102], 118: 102, 119: 102, // jack-o-lantern
				108: [110,108,109,109], 109: 108, 110: 108, // piston
				116: [20,20,116,116], // wood pine
				117: [20,20,117,117], // wood birch
				121: [122,122,121,124], 122: 121, 124: 121, // cake
				123: 121, // cake inside
				// 125,126: mushroom top
				// 134,135,149,150,151,152: bed 
				136: [136,136,137,137], 137: 136, // melon
				138: [154,154,138,155], 154: 138, 155: 138, // cauldron
				158: [159,159,158,175], 159: 158,  // end portal
				166: [182,182,166,183], 182: 166, 183: 166, // enchant table
				176: [192,192,176,208], 192: 176, 208: 176 // sandstone
			};
		},

	}
});
