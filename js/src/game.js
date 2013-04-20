require(["gl", "glmatrix", "data", "input"], function(gl, glmat, data, input) {
	function display() {
		gl.clearColor.apply(this,data.background);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, data.vertexBuffer);
		gl.vertexAttribPointer(data.aPosition, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, data.colorBuffer);
		gl.vertexAttribPointer(data.aColor, 4, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	function tick() {
		requestAnimFrame(tick);
		display();
	}

	tick();
});


