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
			glmat.mat4.perspective(data.world.m.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			//glmat.mat4.rotateX(data.mvMatrix, data.mvMatrix, .01);
			glmat.mat4.rotateY(data.world.m.vMatrix, data.world.m.vMatrix, .01);

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);
			gl.uniformMatrix3fv(data.world.u.NMatrix, false, data.world.m.nMatrix);

			// DEBUG
			gl.uniform3fv(data.world.u.AmbientColor, [.2,.2,.4]);
			//gl.uniform3fv(data.uPointLightingLocation, [100,100,100]);
			//gl.uniform3fv(data.uPointLightingColor, [.8,.4,.4]);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			// Bind buffers
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.vertexObject);
			gl.vertexAttribPointer(data.world.a.Position, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.texCoordObject);
			gl.vertexAttribPointer(data.world.a.Texture, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.normalObject);
			gl.vertexAttribPointer(data.world.a.Normal, 3, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.level.textureAtlas.texture);
			gl.uniform1i(data.world.u.Sampler, 0);

			gl.uniform1f(data.world.u.Light[0].enabled, 1);
			gl.uniform3fv(data.world.u.Light[0].color, [1,0,0]);
			gl.uniform3fv(data.world.u.Light[0].position, [10,0,0]);
			gl.uniform1f(data.world.u.Light[1].enabled, 1);
			gl.uniform3fv(data.world.u.Light[1].color, [0,1,0]);
			gl.uniform3fv(data.world.u.Light[1].position, [0,10,0]);
			gl.uniform1f(data.world.u.Light[2].enabled, 1);
			gl.uniform3fv(data.world.u.Light[2].color, [0,0,1]);
			gl.uniform3fv(data.world.u.Light[2].position, [0,0,10]);


			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, this.level.numVertices(), gl.UNSIGNED_SHORT, 0);
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


