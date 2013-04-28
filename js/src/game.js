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
				cubes[0][0][0] = 120;

				this.lights = [];
				//this.lights[0] = new light.PointLight([1.0, 0.5, 0.0], [0,-1,1]);
				this.lights[0] = new light.PointLight([0.0, 0.0, 0.0], [0,-1,1]);
				this.lights[1] = new light.PointLight([0.0, 0.0, 1.0], [8,8,8]);
				this.camera = new camera.Camera();

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

			if (input.rightClick) {
				var angleChange = [-input.mouseMove[1]*data.rotateSpeed, 0, input.mouseMove[0]*data.rotateSpeed];
				this.camera.changeAngle(angleChange);
			}

			input.mouseMove = [0,0];
			if (input.scroll) {
				this.camera.changeDistance(-input.scroll);
				input.scroll = 0;
			}
			this.camera.updateMatrix(this.level.cubes);

			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);
			gl.uniformMatrix3fv(data.world.u.NMatrix, false, data.world.m.nMatrix);

			// DEBUG
			gl.uniform3fv(data.world.u.AmbientColor, [1,1,1]);

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
				this.lights[i].update();
				gl.uniform1f(data.world.u.Light[i].enabled, this.lights[i].enabled);
				gl.uniform3fv(data.world.u.Light[i].attenuation, this.lights[i].attenuation);
				gl.uniform3fv(data.world.u.Light[i].color, this.lights[i].color);
				gl.uniform3fv(data.world.u.Light[i].position, this.lights[i].position);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, this.level.numVertices(), gl.UNSIGNED_SHORT, 0);

			var objPos = [0,0.5,0];

/*
			var n = glmat.vec3.create();
			glmat.vec3.sub(n, this.camera.pos, objPos);
			glmat.vec3.normalize(n, n);
			var right = glmat.vec3.create();
			glmat.vec3.cross(right, this.camera.up, n);
			glmat.vec3.normalize(right, right);
			var up = glmat.vec3.create();
			glmat.vec3.cross(up, n, right);
			glmat.vec3.normalize(up, up);

			var m = glmat.mat4.create();
			glmat.mat4.identity(m);
			m[0] = right[0];
			m[4] = right[1];
			m[8] = right[2];
			m[1] = up[0];
			m[5] = up[1];
			m[9] = up[2];
			m[2] = n[0];
			m[6] = n[1];
			m[10] = n[2];
			m[3] = objPos[0];
			m[7] = objPos[1];
			m[11] = objPos[2];
			m[12] = m[13] = m[14] = 0;
			m[15] = 1;

			glmat.mat4.transpose(m,m);
			//glmat.mat4.mul(m, m, this.camera.matrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, m);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

			return;
			*/
			var objToCam = glmat.vec3.create();
			glmat.vec3.sub(objToCam, this.camera.pos, objPos);
			var objToCamProj = glmat.vec3.clone(objToCam);
			objToCamProj[2] = 0;
			glmat.vec3.normalize(objToCamProj, objToCamProj);

			var look = glmat.vec3.create(); 
			glmat.vec3.sub(look, this.camera.pos, objPos);
			glmat.vec3.normalize(look, look);

			var upAux = glmat.vec3.create(); 
			glmat.vec3.cross(upAux, look, objToCamProj);
			glmat.vec3.normalize(upAux,upAux);
			var angleCosine = glmat.vec3.dot(look, objToCamProj);

			var vMat = glmat.mat4.create();
			//glmat.mat4.identity(vMat);
			if ((angleCosine < 0.9999) && (angleCosine > -0.9999)) {
				glmat.mat4.rotate(vMat, this.camera.matrix, -Math.acos(angleCosine), upAux);
				//glmat.mat4.mul(vMat, vMat, this.camera.matrix);
			}

			glmat.vec3.normalize(objToCam, objToCam);
			angleCosine = glmat.vec3.dot(objToCamProj, objToCam);
			glmat.mat4.rotateZ(vMat, vMat, this.camera.theta[2]-Math.PI/2);
			//if ((angleCosine < 0.9999) && (angleCosine > -0.9999)) {
				//if (objToCam[1] < 0)
					//glmat.mat4.rotate(vMat, vMat, -Math.acos(angleCosine), [0,0,1]);
				//else
					//glmat.mat4.rotate(vMat, vMat, -Math.acos(angleCosine), [0,0,-1]);
			//}

			gl.uniformMatrix4fv(data.world.u.VMatrix, false, vMat);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


