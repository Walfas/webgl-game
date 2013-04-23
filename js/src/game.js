require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, input) {

		this.ta = new texture.TextureAtlas("img/jolicraft.png", 16);
		this.terrain = null;
		
		checkLoaded();
		function checkLoaded() {
			if (this.ta.texture) {
				this.terrain = new terrain.Terrain(ta);

				//DEBUG
				var land = [[[]]];
				for (var z=0; z<16; z++) {
					land[z] = [];
					for (var y=0; y<16; y++) {
						land[z][y] = [];
						for (var x=0; x<16; x++) {
							if(Math.random() > 0.05) {
								land[z][y][x] = 0;
								continue;
							}
							land[z][y][x] = Math.floor(Math.random()*256);
						}
					}
				}

				this.terrain.generate(land);
				tick();
			}
			else 
				window.setTimeout(checkLoaded, 100);
		}


		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			//glmat.mat4.rotateX(data.mvMatrix, data.mvMatrix, .01);
			glmat.mat4.rotateY(data.mvMatrix, data.mvMatrix, .01);

			gl.uniformMatrix4fv(data.uMVMatrix, false, data.mvMatrix);
			gl.uniformMatrix4fv(data.uPMatrix, false, data.pMatrix);
			gl.uniformMatrix3fv(data.uNMatrix, false, data.nMatrix);

			// DEBUG
			gl.uniform3fv(data.uAmbientColor, [.2,.2,.4]);
			gl.uniform3fv(data.uPointLightingLocation, [100,100,100]);
			gl.uniform3fv(data.uPointLightingColor, [.8,.4,.4]);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			// Bind buffers
			gl.bindBuffer(gl.ARRAY_BUFFER, this.terrain.vertexObject);
			gl.vertexAttribPointer(data.aPosition, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.terrain.texCoordObject);
			gl.vertexAttribPointer(data.aTexture, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.terrain.normalObject);
			gl.vertexAttribPointer(data.aNormal, 3, gl.FLOAT, false, 0, 0);

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


