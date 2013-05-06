require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "sprites", "light", "camera", "input", "dungeon-convert"], 
	function(canvas, gl, glmat, data, texture, terrain, sprites, light, camera, input, dungeonConvert) {

		texture.land = new texture.TextureAtlas("img/ldfaithful.png", 8);
		texture.sprites = null;
		this.level = null;
		this.sprites = null;
		this.counter = 0;
		
		checkLoaded();
		function checkLoaded() {
			// TODO: fix this up
			if (!texture.land.texture) {
				window.setTimeout(checkLoaded, 100);
				return;
			}
			if (!texture.sprites) {
				texture.sprites = new texture.TextureAtlas("img/oryx.png", 8);
				window.setTimeout(checkLoaded, 100);
				return;
			}
			if (!texture.sprites.texture) {
				window.setTimeout(checkLoaded, 100);
				return;
			}
			this.level = new terrain.Terrain(texture.land);

			//DEBUG
			//var cubes = dungeonConvert([50,50],[5,5],[2,2]);

			var cubes = [[[]]];
			var levelSize = [16, 50, 2];
			for (var z=0; z<levelSize[2]; z++) {
				cubes[z] = [];
				for (var y=0; y<levelSize[1]; y++) {
					cubes[z][y] = [];
					for (var x=0; x<levelSize[0]; x++) {
						if (z==0) {
							cubes[z][y][x] = (Math.random() > 0.3) ? 3 : 2;
							continue;
						}

						if (Math.random() > 0.3) {
							cubes[z][y][x] = 0;
							continue;
						}

						var tiles = [1, 2, 3, 4];
						var tileNum = tiles[Math.floor(Math.random()*tiles.length)];

						//cubes[z][y][x] = Math.floor(Math.random()*256);
						cubes[z][y][x] = tileNum;
						//cubes[z][y][x] = y*16+x;
					}
				}
			}

			this.lights = [];
			this.lights[0] = new light.PointLight([1.0, 0.5, 0.0], [0,0,1], [0.3, 0.1, 0.05]);
			this.lights[1] = new light.PointLight([1.0, 0.5, 0.0], [8,15,1.5], [0.3, 0.1, 0.05]);
			//this.lights[1] = new light.PointLight([0.0, 0.0, 1.0], [8,5,1.5], [0, 0.2, 0]);
			//this.lights[2] = new light.PointLight([0.0, 1.0, 0.0], [8,15,1.5], [0, 0.5, 0]);
			//this.lights[3] = new light.PointLight([1.0, 0.0, 0.0], [8,35,1.5], [0, 0.5, 0]);
			this.camera = new camera.Camera();
			this.ambient = [0.0, 0.0, 0.1];

			this.level.generate(cubes);

			this.sprites = new sprites.Sprites(texture.sprites);
			//this.sprites.addSprite(14, [1,1,1]);
			this.sprites.addSprite(Math.floor(Math.random()*256), [1,1,1]);
			this.sprites.addSprite(Math.floor(Math.random()*256), [1,1,1]);
			this.sprites.sprites[1].maxSpeed /= 2;
			this.player = this.sprites.sprites[0];
			this.sprites.update();

			tick();
		}

		function renderWorld() {
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.BACK);
			gl.useProgram(data.world.program);
			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);

			gl.uniform3fv(data.world.u.AmbientColor, this.ambient);

			updateLights(data.world);
			// Bind buffers
			attribSetup(data.world.a.Position, this.level.vertexObject, 3);
			attribSetup(data.world.a.Texture, this.level.texCoordObject, 2);
			attribSetup(data.world.a.Normal, this.level.normalObject, 3);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.level.textureAtlas.texture);
			gl.uniform1i(data.world.u.Sampler, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.level.indexObject);
			gl.drawElements(gl.TRIANGLES, this.level.numVertices(), gl.UNSIGNED_SHORT, 0);
		}

		function updateLights(program) {
			for (var i=0; i<this.lights.length; i++) {
				this.lights[i].update();
				gl.uniform1f(program.u.Light[i].enabled, this.lights[i].enabled);
				gl.uniform3fv(program.u.Light[i].attenuation, this.lights[i].attenuation);
				gl.uniform3fv(program.u.Light[i].color, this.lights[i].color);
				gl.uniform3fv(program.u.Light[i].position, this.lights[i].position);
			}
		}

		function handleInputs() {
			var inputMask = 0;
			if (input.pressedKeys[87]) inputMask += 1; // W
			if (input.pressedKeys[65]) inputMask += 2; // A
			if (input.pressedKeys[83]) inputMask += 4; // S
			if (input.pressedKeys[68]) inputMask += 8; // D

			switch(inputMask) {
			case  1: this.player.turnAndMove(this.level, 0); break;
			case  2: this.player.flipped = 1; this.player.turnAndMove(this.level, Math.PI/2); break;
			case  3: this.player.flipped = 1; this.player.turnAndMove(this.level, Math.PI/4); break;
			case  4: this.player.turnAndMove(this.level, Math.PI); break;
			case  6: this.player.flipped = 1; this.player.turnAndMove(this.level, 3/4*Math.PI); break;
			case  8: this.player.flipped = 0; this.player.turnAndMove(this.level,-Math.PI/2); break;
			case  9: this.player.flipped = 0; this.player.turnAndMove(this.level,-Math.PI/4); break;
			case 12: this.player.flipped = 0; this.player.turnAndMove(this.level, 5/4*Math.PI); break;
			}

			if (input.rightClick) {
				var angleChange = [-input.mouseMove[1]*data.rotateSpeed, 0, input.mouseMove[0]*data.rotateSpeed];
				this.camera.changeAngle(angleChange);
			}

			input.mouseMove = [0,0];
			if (input.scroll) {
				this.camera.changeDistance(input.scroll);
				input.scroll = 0;
			}
		}

		function attribSetup(attrib, object, size, type) {
			if (!type)
				type = gl.FLOAT;
			gl.enableVertexAttribArray(attrib);
			gl.bindBuffer(gl.ARRAY_BUFFER, object);
			gl.vertexAttribPointer(attrib, size, type, false, 0, 0);
		}

		function renderSprites() {
			gl.disable(gl.CULL_FACE);
			this.counter++;

			gl.useProgram(data.sprites.program);
			data.world.m.vMatrix = this.camera.matrix;

			this.sprites.sprites[0].theta = this.camera.theta[2];
			this.sprites.update();

			gl.uniformMatrix4fv(data.sprites.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.sprites.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.sprites.u.PMatrix, false, data.world.m.pMatrix);

			gl.uniform1f(data.sprites.u.Counter, this.counter);
			gl.uniform3fv(data.sprites.u.AmbientColor, this.ambient);
			gl.uniform3fv(data.sprites.u.CamPos, this.camera.pos);

			updateLights(data.sprites);

			// Bind buffers
			attribSetup(data.sprites.a.Position, this.sprites.vertexObject, 3);
			attribSetup(data.sprites.a.Texture, this.sprites.texCoordObject, 2);
			attribSetup(data.sprites.a.Offset, this.sprites.offsetObject, 3);
			attribSetup(data.sprites.a.Moving, this.sprites.movingObject, 1);
			attribSetup(data.sprites.a.Flipped, this.sprites.flippedObject, 1);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.sprites.textureAtlas.texture);
			gl.uniform1i(data.sprites.u.Sampler, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sprites.indexObject);
			gl.drawElements(gl.TRIANGLES, this.sprites.numVertices(), gl.UNSIGNED_SHORT, 0);
		}

		function display() {
			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.world.m.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			handleInputs();

			this.lights[0].position = this.player.pos.slice(0);
			this.lights[0].position[2] += 2;
			this.sprites.sprites[1].moveToward(this.level, this.player.pos);
			this.camera.moveCenter(this.player.pos, [0.0, 0.0, 0.5]);
			this.camera.updateMatrix(this.level.cubes);

			renderWorld();
			renderSprites();
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


