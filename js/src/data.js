define(["gl", "glmatrix", "programs"], 
	function(gl, glmat, programs){
		var data = programs;
		data.background = [0.5, 0.5, 0.5, 1.0];

		gl.useProgram(data.world.program);

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);
		return data;
	}
);

