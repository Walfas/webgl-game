require(["canvas", "gl", "glmatrix", "data", "texture", "terrain", "input"], 
	function(canvas, gl, glmat, data, texture, terrain, input) {

		this.ta = new texture.TextureAtlas("img/texture.png", 16);
		this.t = null;
		
		checkLoaded();
		function checkLoaded() {
			if (this.ta.texture) {
				this.ta.getST(0);
				this.t = new terrain.Terrain(ta);
				this.t.generate([
					[
						[1,0,1],
						[0,0,0],
						[1,0,1]
					],
					[
						[0,0,0],
						[0,1,0],
						[0,0,0]
					]
				]);
				this.t.debug();
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

			gl.bindBuffer(gl.ARRAY_BUFFER, this.t.vertexObject);
			gl.vertexAttribPointer(data.attribLocation, 3, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLES, 0, this.t.numVertices());
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}
	}
);


