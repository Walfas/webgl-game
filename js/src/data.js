define(["gl", "glmatrix", "programs"], 
	function(gl, glmat, programs){
		var worldProgram = programs.worldShader;
		var depthProgram = programs.depthShader;

		var data = {
			world: {
				program: worldProgram,

				aPosition: gl.getAttribLocation(worldProgram, "aPosition"),
				aTexture: gl.getAttribLocation(worldProgram, "aTexture"),
				aNormal: gl.getAttribLocation(worldProgram, "aNormal"),

				uPMatrix: gl.getUniformLocation(worldProgram, "uPMatrix"),
				uNMatrix: gl.getUniformLocation(worldProgram, "uNMatrix"),
				uMMatrix: gl.getUniformLocation(worldProgram, "uMMatrix"),
				uVMatrix: gl.getUniformLocation(worldProgram, "uVMatrix"),
				uSampler: gl.getUniformLocation(worldProgram, "uSampler"),
				uLightVMatrix: gl.getUniformLocation(worldProgram, "uLightVMatrix"),
				uLightPMatrix: gl.getUniformLocation(worldProgram, "uLightPMatrix"),
				uAmbientColor: gl.getUniformLocation(worldProgram, "uAmbientColor"),
				uDepthMap: gl.getUniformLocation(worldProgram, "uDepthMap"),
				uLight: gl.getUniformLocation(worldProgram, "uLight"),

				pMatrix: glmat.mat4.create(),
				mMatrix: glmat.mat4.create(),
				vMatrix: glmat.mat4.create(),
				nMatrix: glmat.mat3.create(),
			},
			depth: {
				program: depthProgram,

				aPosition: gl.getAttribLocation(depthProgram, "aPosition"),

				uPMatrix: gl.getUniformLocation(depthProgram, "uPMatrix"),
				uMMatrix: gl.getUniformLocation(depthProgram, "uMMatrix"),
				uVMatrix: gl.getUniformLocation(depthProgram, "uVMatrix"),

				pMatrix: glmat.mat4.create(),
				mMatrix: glmat.mat4.create(),
				vMatrix: glmat.mat4.create(),
			},
			background: [0.5, 0.5, 0.5, 1.0],
		};
		gl.useProgram(data.world.program);


		// Initialize projection and model view matrices
		glmat.mat4.identity(data.world.pMatrix);
		glmat.mat4.identity(data.world.mMatrix);
		glmat.mat4.identity(data.world.vMatrix);
		glmat.mat3.identity(data.world.nMatrix);
		gl.enableVertexAttribArray(data.world.aPosition);
		gl.enableVertexAttribArray(data.world.aTexture);
		gl.enableVertexAttribArray(data.world.aNormal);

		glmat.mat4.identity(data.depth.pMatrix);
		glmat.mat4.identity(data.depth.mMatrix);
		glmat.mat4.identity(data.depth.vMatrix);
		gl.enableVertexAttribArray(data.depth.aPosition);

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);
		return data;
	}
);

