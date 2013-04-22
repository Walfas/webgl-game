define(["gl", "glmatrix", "util", "text!shaders/vertex.shader", "text!shaders/fragment.shader"], 
	function(gl, glmat, util, vShader, fShader){
		program = util.initShader(vShader, fShader);
		gl.useProgram(program);

		var data = {
			program: program,
			background: [0.5, 0.5, 0.5, 1.0],

			pMatrix: glmat.mat4.create(),
			mvMatrix: glmat.mat4.create(),

			// Uniforms
			uPMatrix: null,
			uMVMatrix: null,
		};

		// Initialize projection and model view matrices
		glmat.mat4.identity(data.pMatrix);
		glmat.mat4.identity(data.mvMatrix);

		data.attribLocation = gl.getAttribLocation(program, "aPosition");
		gl.enableVertexAttribArray(data.attribLocation);

		data.uPMatrix = gl.getUniformLocation(data.program, "uPMatrix");
		data.uMVMatrix = gl.getUniformLocation(data.program, "uMVMatrix");

		gl.enable(gl.DEPTH_TEST);
		return data;
	}
);

