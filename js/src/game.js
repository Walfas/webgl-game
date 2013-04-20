require(["canvas", "gl", "glmatrix", "data", "input"], 
	function(canvas, gl, glmat, data, input) {
		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			//glmat.mat4.perspective(data.pMatrix, 45, canvas.width/canvas.height, 0.1, 100.0);

			glmat.mat4.rotateY(data.mvMatrix, data.mvMatrix, .01);

			gl.uniformMatrix4fv(data.uMVMatrix, false, data.mvMatrix);
			gl.uniformMatrix4fv(data.uPMatrix, false, data.pMatrix);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, data.position.bufferObject);
			gl.vertexAttribPointer(data.position.attribLocation, data.position.size, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, data.color.bufferObject);
			gl.vertexAttribPointer(data.color.attribLocation, data.color.size, gl.FLOAT, false, 0, 0);

			gl.drawArrays(gl.TRIANGLES, 0, data.position.numElements());
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}

		tick();
	}
);


