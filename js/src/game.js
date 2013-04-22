require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, input) {

		this.ta = new texture.TextureAtlas("img/texture.png", 8);
		this.terrain = null;
		
		checkLoaded();
		function checkLoaded() {
			if (this.ta.texture) {
				this.terrain = new terrain.Terrain(ta);

				this.terrain.generate([
					[
						[0,0,0],
						[0,1,0],
						[0,0,0]
					],
					[
						[0,1,0],
						[1,1,1],
						[0,1,0]
					],
					[
						[0,0,0],
						[0,1,0],
						[0,0,0]
					],
				]);
				this.terrain.debug();
				tick();
			}
			else 
				window.setTimeout(checkLoaded, 100);
		}


		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			glmat.mat4.rotateX(data.mvMatrix, data.mvMatrix, .01);
			glmat.mat4.rotateY(data.mvMatrix, data.mvMatrix, .01);

			gl.uniformMatrix4fv(data.uMVMatrix, false, data.mvMatrix);
			gl.uniformMatrix4fv(data.uPMatrix, false, data.pMatrix);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			// Bind buffers
			gl.bindBuffer(gl.ARRAY_BUFFER, this.terrain.vertexObject);
			gl.vertexAttribPointer(data.attribLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.terrain.texCoordObject);
			gl.vertexAttribPointer(data.textureLocation, 2, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.terrain.textureAtlas.texture);
			gl.uniform1i(data.uSampler, 0);

			gl.drawArrays(gl.TRIANGLES, 0, this.terrain.numVertices());
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


