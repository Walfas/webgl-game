define(["gl","texture"], function(gl,texture) {
	return {
		Sprites: function(textureAtlas) {
			this.textureAtlas = textureAtlas;
			this.sprites = [];
			this.vertices = [];
			this.offsets = [];
			this.texCoords = [];
			this.indices = [];
			this.baseIndex = 0;
			this.vertexObject = gl.createBuffer();
			this.texCoordObject = gl.createBuffer();
			this.offsetObject = gl.createBuffer();
			this.indexObject = gl.createBuffer();

			this.numVertices = function() { return this.indices.length; };

			this.update = function() {
				// Initialize buffer data
				gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetObject);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.offsets), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexObject);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

				gl.bindBuffer(gl.ARRAY_BUFFER, null);
			}

			this.addSprite = function(tileNum, pos) {
				/* 1--0
				   |  |
				   2--3 */
				var o = [
					[ 0.5, 0.0, 1.0],
					[-0.5, 0.0, 1.0],
					[-0.5, 0.0, 0.0],
					[ 0.5, 0.0, 0.0]
				];
				this.sprites.push(tileNum);
				for (var i=0; i<4; i++) {
					this.vertices = this.vertices.concat(pos);
					this.offsets = this.offsets.concat(o[i]);
				}
				var st = this.textureAtlas.getST(tileNum);

				this.texCoords = this.texCoords.concat(
					st[2], st[1], 
					st[0], st[1], 
					st[0], st[3],
					st[2], st[3]
				);

				this.indices.push(
					this.baseIndex, this.baseIndex+1, this.baseIndex+2,
					this.baseIndex, this.baseIndex+2, this.baseIndex+3
				);
				this.baseIndex += 4;
			}

			this.moveSprite = function(spriteId, pos) {
				for (var i=0; i<4; i++) 
					for (var j=0; j<3; j++) 
						this.vertices[spriteId*4+i*3+j] = pos[j];
			}

			this.offsetSprite = function(spriteId, d) {
				for (var i=0; i<4; i++) 
					for (var j=0; j<3; j++) 
						this.vertices[spriteId*4+i*3+j] += d[j];
			}
		}
	}
});
