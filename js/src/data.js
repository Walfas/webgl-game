define(["gl", "glmatrix", "programs"], 
	function(gl, glmat, programs){
		var worldProgram = programs.world;
		var depthProgram = programs.depth;

		var data = programs;
		data.world.pMatrix = glmat.mat4.create();
		data.world.mMatrix = glmat.mat4.create();
		data.world.vMatrix = glmat.mat4.create();
		data.world.nMatrix = glmat.mat3.create();

		data.depth.pMatrix = glmat.mat4.create();
		data.depth.mMatrix = glmat.mat4.create();
		data.depth.vMatrix = glmat.mat4.create();

		data.background = [0.5, 0.5, 0.5, 1.0];
		gl.useProgram(data.world.program);

		// Initialize projection and model view matrices
		glmat.mat4.identity(data.world.pMatrix);
		glmat.mat4.identity(data.world.mMatrix);
		glmat.mat4.identity(data.world.vMatrix);
		glmat.mat3.identity(data.world.nMatrix);

		glmat.mat4.identity(data.depth.pMatrix);
		glmat.mat4.identity(data.depth.mMatrix);
		glmat.mat4.identity(data.depth.vMatrix);

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);
		return data;
	}
);

