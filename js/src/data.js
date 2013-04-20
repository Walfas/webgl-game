define(["gl", "glmatrix", "util", "text!shaders/vertex.shader", "text!shaders/fragment.shader"], 
	function(gl, glmat, util, vShader, fShader){
		var data = {
			background: [0.5, 0.5, 0.5, 1.0],
			vertices: [
				-1,  0,  0,
				 0,  1,  0,
				 0, -1,  0,
				 1,  0,  0
			],
			colors: [
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 0.0, 1.0
			],

			// Attributes
			aPosition: null,
			aColor: null,

			// Buffer objects
			vertexBuffer: null,
			colorBuffer: null
		};

		data.program = util.initShader(vShader, fShader);
		gl.useProgram(data.program);

		data.aPosition = gl.getAttribLocation(data.program, "aPosition");
		gl.enableVertexAttribArray(data.aPosition);

		data.aColor = gl.getAttribLocation(data.program, "aColor")
		gl.enableVertexAttribArray(data.aColor);

		// Initialize buffers
		data.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, data.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

		data.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, data.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.STATIC_DRAW);

		gl.enable(gl.DEPTH_TEST);
		return data;
	}
);

