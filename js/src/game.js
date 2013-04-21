require(["canvas", "gl", "glmatrix", "data", "input"], 
	function(canvas, gl, glmat, data, input) {
		function display() {
			gl.viewport(0, 0, canvas.width, canvas.height);
			glmat.mat4.perspective(data.pMatrix, 45.0, canvas.width/canvas.height, 0.1, 100.0);

			glmat.mat4.rotateX(data.mvMatrix, data.mvMatrix, .01);
			glmat.mat4.rotateY(data.mvMatrix, data.mvMatrix, .01);

			gl.uniformMatrix4fv(data.uMVMatrix, false, data.mvMatrix);
			gl.uniformMatrix4fv(data.uPMatrix, false, data.pMatrix);

			gl.clearColor.apply(this,data.background);
			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
			
/*
			gl.bindBuffer(gl.ARRAY_BUFFER, data.vertices.bufferObject);
			gl.vertexAttribPointer(data.vertices.attribLocation, data.vertices.size, gl.FLOAT, false, 0, 0);

			gl.drawElements(gl.TRIANGLES, data.vertexIndices.numElements(), gl.UNSIGNED_SHORT, 0);
*/
			gl.bindBuffer(gl.ARRAY_BUFFER, data.cube.vertexObject);
			gl.vertexAttribPointer(data.cube.attribLocation, 3, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, data.cube.indexObject);
			gl.drawElements(gl.TRIANGLES, data.cube.numIndices, gl.UNSIGNED_BYTE, 0);
		}

		function tick() {
			requestAnimFrame(tick);
			display();
		}

		tick();
	}
);


