require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, input) {

		this.ta = new texture.TextureAtlas("img/jolicraft.png", 16);
		this.terrain = null;
		
		checkLoaded();
		function checkLoaded() {
			if (this.ta.texture) {
				this.terrain = new terrain.Terrain(ta);

				this.terrain.generate([
					[
						[3,0,5],
						[0,0,0],
						[8,0,20]
					],
					[
						[0,44,0],
						[43,0,46],
						[0,69,0]
					],
					[
						[74,0,77],
						[0,102,0],
						[108,0,121]
					],
				]);
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


