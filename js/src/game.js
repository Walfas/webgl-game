require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "sprites", "light", "camera", "input", "dungeon-convert", "levels"], 
	function(canvas, gl, glmat, data, texture, terrain, sprites, light, camera, input, dungeon, levels) {
		texture.land = new texture.TextureAtlas("img/ldfaithful.png", 8);
		texture.sprites = null;
		this.terrain = null;
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
			this.terrain = new terrain.Terrain(texture.land);

			//DEBUG
			this.camera = new camera.Camera();

			this.levelNum = 0;
			this.level = levels.getLevel(this.levelNum);

			this.lights = [];
			this.lights[0] = new light.PointLight([1.0, 0.5, 0.0], [0,0,1], [0.3, 0.1, 0.05]);

			this.sprites = new sprites.Sprites(texture.sprites);
			this.sprites.addSprite(Math.floor(Math.random()*256), [0,0,0]);
			this.player = this.sprites.sprites[0];

			this.sprites.addSprite(Math.floor(Math.random()*256), [0,0,1]);
			this.sprites.sprites[1].maxSpeed /= 2;

			this.sprites.update();

			goToLevel(0);
			tick();
		}

		function goToLevel(l) {
			this.level = levels.getLevel(l);
			this.dungeonObj = new dungeon(this.level);
			this.lights[1] = new light.PointLight([1.0, 0.5, 0.0], centerXY(this.dungeonObj.upstairs), [0.2, 0.1, 0.05]);
			this.terrain.generate(this.dungeonObj.cubes);

			player.pos = centerXY(this.dungeonObj.upstairs);
			this.sprites.sprites[1].pos = centerXY(this.dungeonObj.upstairs);
			this.sprites.update();
		}


		function centerXY(pos) {
			return [pos[0]+0.5, pos[1]+0.5, pos[2]];
		}

		function renderWorld() {
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl.BACK);
			gl.useProgram(data.world.program);
			data.world.m.vMatrix = this.camera.matrix;

			gl.uniformMatrix4fv(data.world.u.MMatrix, false, data.world.m.mMatrix);
			gl.uniformMatrix4fv(data.world.u.VMatrix, false, data.world.m.vMatrix);
			gl.uniformMatrix4fv(data.world.u.PMatrix, false, data.world.m.pMatrix);

			gl.uniform3fv(data.world.u.AmbientColor, this.level.ambient);

			updateLights(data.world);
			// Bind buffers
			attribSetup(data.world.a.Position, this.terrain.vertexObject, 3);
			attribSetup(data.world.a.Texture, this.terrain.texCoordObject, 2);
			attribSetup(data.world.a.Normal, this.terrain.normalObject, 3);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.terrain.textureAtlas.texture);
			gl.uniform1i(data.world.u.Sampler, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.terrain.indexObject);
			gl.drawElements(gl.TRIANGLES, this.terrain.numVertices(), gl.UNSIGNED_SHORT, 0);
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
			case  1: this.player.turnAndMove(this.terrain, 0); break;
			case  2: this.player.flipped = 1; this.player.turnAndMove(this.terrain, Math.PI/2); break;
			case  3: this.player.flipped = 1; this.player.turnAndMove(this.terrain, Math.PI/4); break;
			case  4: this.player.turnAndMove(this.terrain, Math.PI); break;
			case  6: this.player.flipped = 1; this.player.turnAndMove(this.terrain, 3/4*Math.PI); break;
			case  8: this.player.flipped = 0; this.player.turnAndMove(this.terrain,-Math.PI/2); break;
			case  9: this.player.flipped = 0; this.player.turnAndMove(this.terrain,-Math.PI/4); break;
			case 12: this.player.flipped = 0; this.player.turnAndMove(this.terrain, 5/4*Math.PI); break;
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
			gl.uniform3fv(data.sprites.u.AmbientColor, this.level.ambient);
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
			this.sprites.sprites[1].moveToward(this.terrain, this.player.pos);
			this.camera.moveCenter(this.player.pos, [0.0, 0.0, 0.5]);
			this.camera.updateMatrix(this.terrain.cubes);

			checkStairs();

			renderWorld();
			renderSprites();
		}

		function checkStairs() {
			var cubePos = [0,0,0];
			for (var i=0; i<3; i++)
				cubePos[i] = Math.floor(player.pos[i]);
			if (cubePos[0] == this.dungeonObj.downstairs[0] && 
				cubePos[1] == this.dungeonObj.downstairs[1]) {
				goToLevel(this.levelNum++);
			}
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


