require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "light", "camera", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, light, camera, input) {

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

				this.lights = [];
				this.lights[0] = new light.PointLight([1.0, 0.5, 0.0]);
				this.camera = new camera.Camera();
				//this.theta = [-Math.PI/2, 0.0, 0.0];
				//this.scale = 1.0;

				this.level.generate(cubes);

				tick();
			}
			else 
				window.setTimeout(checkLoaded, 100);
		}


		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.world.m.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			if (input.pressedKeys[65]) this.lights[0].position[0] -= 0.1;
			if (input.pressedKeys[68]) this.lights[0].position[0] += 0.1;
			if (input.pressedKeys[83]) this.lights[0].position[1] -= 0.1;
			if (input.pressedKeys[87]) this.lights[0].position[1] += 0.1;
			this.camera.moveCenter(this.lights[0].position);

			//var viewMatrix = glmat.mat4.create();
			//glmat.mat4.identity(viewMatrix);
			if (input.rightClick) {
			/*
				this.theta[0] += input.mouseMove[1] * data.rotateSpeed;
				this.theta[2] += input.mouseMove[0] * data.rotateSpeed;
				this.theta[0] = this.theta[0].clamp(data.rotateLimits[0],data.rotateLimits[1]);
			*/
				var angleChange = [-input.mouseMove[1]*data.rotateSpeed, 0, input.mouseMove[0]*data.rotateSpeed];
				this.camera.changeAngle(angleChange);
			}
			/*
			glmat.mat4.rotateX(viewMatrix, viewMatrix, this.theta[0]);
			glmat.mat4.rotateY(viewMatrix, viewMatrix, this.theta[1]);
			glmat.mat4.rotateZ(viewMatrix, viewMatrix, this.theta[2]);
			glmat.mat4.scale(viewMatrix, viewMatrix, [this.scale, this.scale, this.scale]);
			*/

			input.mouseMove = [0,0];
			if (input.scroll) {
			/*
				this.scale += input.scroll * 0.1;
				this.scale = this.scale.clamp(data.zoomLimits[0],data.zoomLimits[1]);
				*/
				this.camera.changeDistance(input.scroll);
				input.scroll = 0;
			}
			this.camera.updateMatrix();

			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);
			gl.uniformMatrix3fv(data.world.u.NMatrix, false, data.world.m.nMatrix);

			// DEBUG
			gl.uniform3fv(data.world.u.AmbientColor, [0.5,0.5,0.5]);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			// Bind buffers
			gl.enableVertexAttribArray(data.world.a.Position);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.vertexObject);
			gl.vertexAttribPointer(data.world.a.Position, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.world.a.Texture);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.texCoordObject);
			gl.vertexAttribPointer(data.world.a.Texture, 2, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.world.a.normalObject);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.normalObject);
			gl.vertexAttribPointer(data.world.a.Normal, 3, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.level.textureAtlas.texture);
			gl.uniform1i(data.world.u.Sampler, 0);

			for (var i=0; i<this.lights.length; i++) {
				gl.uniform1f(data.world.u.Light[i].enabled, this.lights[i].enabled);
				gl.uniform3fv(data.world.u.Light[i].attenuation, this.lights[i].attenuation);
				gl.uniform3fv(data.world.u.Light[i].color, this.lights[i].color);
				gl.uniform3fv(data.world.u.Light[i].position, this.lights[i].position);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, this.level.numVertices(), gl.UNSIGNED_SHORT, 0);
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


