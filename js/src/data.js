define(["gl", "glmatrix", "programs"], 
	function(gl, glmat, programs){
		var program = programs.worldShader;
		gl.useProgram(programs.worldShader);

		var data = {
			program: programs.worldShader,
			background: [0.5, 0.5, 0.5, 1.0],

			pMatrix: glmat.mat4.create(),
			mvMatrix: glmat.mat4.create(),
			nMatrix: glmat.mat3.create(),

			// Uniforms
			uPMatrix: null,
			uMVMatrix: null,
			uNMatrix: null,
		};

		// Initialize projection and model view matrices
		glmat.mat4.identity(data.pMatrix);
		glmat.mat4.identity(data.mvMatrix);
		glmat.mat3.identity(data.nMatrix);

		data.aPosition = gl.getAttribLocation(program, "aPosition");
		gl.enableVertexAttribArray(data.aPosition);

		data.aTexture = gl.getAttribLocation(program, "aTexture");
		gl.enableVertexAttribArray(data.aTexture);

		data.aNormal = gl.getAttribLocation(program, "aNormal");
		gl.enableVertexAttribArray(data.aNormal);

		data.uPMatrix = gl.getUniformLocation(data.program, "uPMatrix");
		data.uNMatrix = gl.getUniformLocation(data.program, "uNMatrix");
		data.uMVMatrix = gl.getUniformLocation(data.program, "uMVMatrix");
		data.uSampler = gl.getUniformLocation(data.program, "uSampler");

		data.uAmbientColor = gl.getUniformLocation(data.program, "uAmbientColor");
		data.uPointLightingLocation = gl.getUniformLocation(data.program, "uPointLightingLocation");
		data.uPointLightingColor = gl.getUniformLocation(data.program, "uPointLightingColor");

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);
		return data;
	}
);

