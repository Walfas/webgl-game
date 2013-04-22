define(["gl"], function(gl) {
	return {
		TextureAtlas: function(url,tileSize) {
			this.tileSizePx = [tileSize,tileSize];
			this.imageSizePx = [0,0];
			this.tileSizeNormalized = [0,0];
			this.tilesPerRow = 0;
			this.texture = null;

			// Load from URL
			this.loadImageTexture = function(url) {
				atlas = this;
				texture = gl.createTexture();
				texture.image = new Image();
				texture.image.onload = function() { atlas.handleTexture(texture.image, texture); };
				texture.image.src = url;
			}

			this.handleTexture = function(image, texture) {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.generateMipmap(gl.TEXTURE_2D);
				gl.bindTexture(gl.TEXTURE_2D, null);

				this.texture = texture;
				this.imageSizePx = [image.width, image.height];

				this.tileSizeNormalized = [
					this.tileSizePx[0]/this.imageSizePx[0], 
					this.tileSizePx[1]/this.imageSizePx[1]
				];
				this.tilesPerRow = Math.floor(this.imageSizePx[0]/this.tileSizePx[0]);
			}

			/** Based on tile number, get the s and t coordinate ranges of the tile.
				returns array of format [s1,t1,s2,t2] */
			this.getST = function(tileNum) {
				var stRange = [
					this.tileSizeNormalized[0] * (tileNum % this.tilesPerRow),
					this.tileSizeNormalized[1] * Math.floor(tileNum / this.tilesPerRow),
				];
				stRange[2] = stRange[0] + this.tileSizeNormalized[0];
				stRange[3] = stRange[1] + this.tileSizeNormalized[1];
				return stRange;
			}

			this.loadImageTexture(url);
		}
	};
});
