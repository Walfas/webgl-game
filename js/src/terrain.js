define(["gl","texture"], function(gl,texture) {
	return {
		Terrain: function(textureAtlas) {
			this.textureAtlas = textureAtlas;
			this.vertices = [];
			this.normals = [];
			this.texCoords = [];
			this.vertexObject = gl.createBuffer();
			this.normalObject = gl.createBuffer();
			this.texCoordObject = gl.createBuffer();

			this.numVertices = function() { return this.vertices.length; };
			
			this.debug = function() {
				console.log(JSON.stringify(this.vertices));
				console.log(JSON.stringify(this.normals));
				console.log(JSON.stringify(this.texCoords));
			}

			/** Add block to terrain (modifies vertices, normals, texCoords) 
				tileNum: Specifies which tile to take from the texture atlas
				pos: [x,y,z] of where this block is located on the terrain
				faces: [left,right,bottom,top,back,front] booleans for whether
					or not the corresponding face will be shown
			*/
			this.addBlock = function(tileNum, pos, faces) {
				var st = this.textureAtlas.getST(tileNum);
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
					[ 0, -1,  0], // bottom
					[ 0,  1,  0], // top
					[ 0,  0, -1], // back
					[ 0,  0,  1]  // front
				];

				// Indices for vertices
				var indices = [
					[1, 6, 7,	1, 7, 2],
					[5, 0, 3,	5, 3, 4],
					[3, 2, 7,	3, 7, 4],
					[5, 6, 1,	5, 1, 0],
					[6, 5, 4,	6, 4, 7],
					[0, 1, 2,	0, 2, 3]
				];
				
				for (var f=0; f<6; f++) {
					if (!faces[f])
						continue;
					this.addFaceVertices(c, indices[f]);
					this.addFaceNormals(n[f]);
					this.addFaceTexCoords(st);
				}
			}

			this.addFaceVertices = function(cube,indices) {
				for (var i=0; i<indices.length; i++)
					this.vertices = this.vertices.concat(cube[indices[i]]);
			}

			this.addFaceNormals = function(newNormal) {
				for (var i=0; i<6; i++) 
					this.normals = this.normals.concat(newNormal);
			}

			this.addFaceTexCoords = function(st) {
				this.texCoords = this.texCoords.concat(
					st[2], st[1], 
					st[0], st[1], 
					st[0], st[3],
					st[2], st[1], 
					st[0], st[3],
					st[2], st[3]
				);
			}
		},

	}
});
