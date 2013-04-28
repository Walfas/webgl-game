require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "sprites", "light", "camera", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, sprites, light, camera, input) {

		texture.land = new texture.TextureAtlas("img/jolicraft.png", 16);
		texture.sprites = null;
		this.level = null;
		this.sprites = null;
		
		checkLoaded();
		function checkLoaded() {
			// TODO: fix this up
			if (!texture.land.texture) {
				window.setTimeout(checkLoaded, 100);
				return;
			}
			if (!texture.sprites) {
				texture.sprites = new texture.TextureAtlas("img/jolicraft.png", 16);
				window.setTimeout(checkLoaded, 100);
				return;
			}
			if (!texture.sprites.texture) {
				window.setTimeout(checkLoaded, 100);
				return;
			}
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
			cubes[0][0][0] = 0;

			this.lights = [];
			//this.lights[0] = new light.PointLight([1.0, 0.5, 0.0], [0,-1,1]);
			this.lights[0] = new light.PointLight([0.0, 0.0, 0.0], [0,-1,1]);
			this.lights[1] = new light.PointLight([0.0, 0.0, 1.0], [8,8,8]);
			this.camera = new camera.Camera();

			this.level.generate(cubes);

			this.sprites = new sprites.Sprites(texture.sprites);
			this.sprites.addSprite(3, [0,0,1]);
			this.sprites.generate();

			tick();
		}

		function renderWorld() {
			gl.useProgram(data.world.program);
			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);

			gl.uniform3fv(data.world.u.AmbientColor, [1,1,1]);

			// Bind buffers
			gl.enableVertexAttribArray(data.world.a.Position);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.vertexObject);
			gl.vertexAttribPointer(data.world.a.Position, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.world.a.Texture);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.level.texCoordObject);
			gl.vertexAttribPointer(data.world.a.Texture, 2, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.world.a.Normal);
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

			gl.disableVertexAttribArray(data.world.a.Position);
			gl.disableVertexAttribArray(data.world.a.Texture);
			gl.disableVertexAttribArray(data.world.a.Normal);
		}

		function handleInputs() {
			if (input.pressedKeys[65]) this.lights[0].position[0] -= 0.1;
			if (input.pressedKeys[68]) this.lights[0].position[0] += 0.1;
			if (input.pressedKeys[83]) this.lights[0].position[1] -= 0.1;
			if (input.pressedKeys[87]) this.lights[0].position[1] += 0.1;

			if (input.rightClick) {
				var angleChange = [-input.mouseMove[1]*data.rotateSpeed, 0, input.mouseMove[0]*data.rotateSpeed];
				this.camera.changeAngle(angleChange);
			}

			input.mouseMove = [0,0];
			if (input.scroll) {
				this.camera.changeDistance(-input.scroll);
				input.scroll = 0;
			}
		}

		function renderSprites() {
			gl.useProgram(data.sprites.program);
			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.sprites.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.sprites.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.sprites.u.PMatrix, false, data.world.m.pMatrix);

			gl.uniform3fv(data.sprites.u.AmbientColor, [1,1,1]);
			gl.uniform3fv(data.sprites.u.CamPos, this.camera.pos);

			// Bind buffers
			gl.enableVertexAttribArray(data.sprites.a.Position);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.sprites.vertexObject);
			gl.vertexAttribPointer(data.sprites.a.Position, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.sprites.a.Texture);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.sprites.texCoordObject);
			gl.vertexAttribPointer(data.sprites.a.Texture, 2, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(data.sprites.a.Offset);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.sprites.offsetObject);
			gl.vertexAttribPointer(data.sprites.a.Offset, 3, gl.FLOAT, false, 0, 0);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.sprites.textureAtlas.texture);
			gl.uniform1i(data.sprites.u.Sampler, 0);

			for (var i=0; i<this.lights.length; i++) {
				this.lights[i].update();
				gl.uniform1f(data.sprites.u.Light[i].enabled, this.lights[i].enabled);
				gl.uniform3fv(data.sprites.u.Light[i].attenuation, this.lights[i].attenuation);
				gl.uniform3fv(data.sprites.u.Light[i].color, this.lights[i].color);
				gl.uniform3fv(data.sprites.u.Light[i].position, this.lights[i].position);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sprites.indexObject);
			gl.drawElements(gl.TRIANGLES, this.sprites.numVertices(), gl.UNSIGNED_SHORT, 0);

			gl.disableVertexAttribArray(data.sprites.a.Position);
			gl.disableVertexAttribArray(data.sprites.a.Texture);
			gl.disableVertexAttribArray(data.sprites.a.Offset);
		}

		function display() {
			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.world.m.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			handleInputs();

			this.camera.moveCenter(this.lights[0].position);
			this.camera.updateMatrix(this.level.cubes);

			renderWorld();
			renderSprites();

/*
			var objPos = [0,0,0];

			var objToCam = glmat.vec3.create();
			glmat.vec3.sub(objToCam, this.camera.pos, objPos);
			var objToCamProj = glmat.vec3.clone(objToCam);
			objToCamProj[2] = 0;
			glmat.vec3.normalize(objToCamProj, objToCamProj);

			var look = glmat.vec3.create(); 
			glmat.vec3.sub(look, this.camera.pos, objPos);
			glmat.vec3.normalize(look, look);
			look = [0,-1,0];

			var upAux = glmat.vec3.create(); 
			glmat.vec3.cross(upAux, look, objToCamProj);
			glmat.vec3.normalize(upAux,upAux);
			var angleCosine = glmat.vec3.dot(look, objToCamProj);

			var vMat = glmat.mat4.create();
			glmat.mat4.rotate(vMat, vMat, Math.acos(angleCosine), upAux);

			glmat.vec3.normalize(objToCam, objToCam);
			angleCosine = glmat.vec3.dot(objToCamProj, objToCam);
			if (objToCam[2] < 0)
				glmat.mat4.rotate(vMat, vMat, Math.acos(angleCosine), [1,0,0]);
			else
				glmat.mat4.rotate(vMat, vMat, -Math.acos(angleCosine), [1,0,0]);

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, vMat);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);
			*/
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


