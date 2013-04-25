require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, input) {

		texture.land = new texture.TextureAtlas("img/jolicraft.png", 16);
		this.level = null;
		
		checkLoaded();
		function checkLoaded() {
			if (texture.land.texture) {
				this.level = new terrain.Terrain(texture.land);

				//DEBUG
				var cubes = [[[]]];
				for (var z=0; z<16; z++) {
					cubes[z] = [];
					for (var y=0; y<16; y++) {
						cubes[z][y] = [];
						for (var x=0; x<16; x++) {
							if(Math.random() > 0.05) {
								cubes[z][y][x] = 0;
								continue;
							}
							cubes[z][y][x] = Math.floor(Math.random()*256);
						}
					}
				}

				this.level.generate(cubes);
				tick();
			}
			else 
				window.setTimeout(checkLoaded, 100);
		}


		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.world.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			//glmat.mat4.rotateX(data.mvMatrix, data.mvMatrix, .01);
			glmat.mat4.rotateY(data.world.vMatrix, data.world.vMatrix, .01);

			gl.uniformMatrix4fv(data.world.u.uMMatrix, false, data.world.mMatrix);
			gl.uniformMatrix4fv(data.world.u.uVMatrix, false, data.world.vMatrix);
			gl.uniformMatrix4fv(data.world.u.uPMatrix, false, data.world.pMatrix);
			gl.uniformMatrix3fv(data.world.u.uNMatrix, false, data.world.nMatrix);

			// DEBUG
			gl.uniform3fv(data.world.u.uAmbientColor, [.2,.2,.4]);
			//gl.uniform3fv(data.uPointLightingLocation, [100,100,100]);
			//gl.uniform3fv(data.uPointLightingColor, [.8,.4,.4]);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			// Bind buffers
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.vertexObject);
			gl.vertexAttribPointer(data.world.a.aPosition, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.texCoordObject);
			gl.vertexAttribPointer(data.world.a.aTexture, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.normalObject);
			gl.vertexAttribPointer(data.world.a.aNormal, 3, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.level.textureAtlas.texture);
			gl.uniform1i(data.world.u.uSampler, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, this.level.numVertices(), gl.UNSIGNED_SHORT, 0);
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


