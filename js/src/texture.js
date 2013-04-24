define(["gl"], function(gl) {
	return {
		TextureAtlas: function(url,tileSize) {
			this.tileSizePx = tileSize;
			this.imageSizePx = 0;
			this.tileSizeNormalized = 0;
			this.tilesPerRow = 0;
			this.paddingNormalized = 0;
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
				gl.bindTexture(gl.TEXTURE_2D, null);

				this.texture = texture;
				this.imageSizePx = image.width; // width must equal height

				this.tileSizeNormalized = this.tileSizePx/this.imageSizePx;
				this.paddingNormalized = 0.5/this.imageSizePx;
				this.tilesPerRow = Math.floor(this.imageSizePx/this.tileSizePx);
			}

			/** Based on tile number, get the s and t coordinate ranges of the tile.
				returns array of format [s1,t1,s2,t2] */
			this.getST = function(tileNum) {
				var stRange = [
					this.tileSizeNormalized * (tileNum % this.tilesPerRow) + this.paddingNormalized,
					this.tileSizeNormalized * Math.floor(tileNum / this.tilesPerRow) + this.paddingNormalized,
				];
				stRange[2] = stRange[0] + this.tileSizeNormalized - this.paddingNormalized;
				stRange[3] = stRange[1] + this.tileSizeNormalized - this.paddingNormalized;
				return stRange;
			}

			this.loadImageTexture(url);
		}
	};
});
