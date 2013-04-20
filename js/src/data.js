define(["gl", "glmatrix", "util", "text!shaders/vertex.shader", "text!shaders/fragment.shader"], 
	function(gl, glmat, util, vShader, fShader){
		program = util.initShader(vShader, fShader);
		gl.useProgram(program);

		function Attribute(name, program, size, values) {
			this.name = name;
			this.values = values;
			this.size = size;
			this.attribLocation = gl.getAttribLocation(program, name);
			gl.enableVertexAttribArray(this.attribLocation);

			this.bufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);

			this.numElements = function() {
				return Math.floor(this.values.length/this.size);
			}
		}

		var data = {
			program: program,
			background: [0.5, 0.5, 0.5, 1.0],

			position: new Attribute("aPosition", program, 3, [
				-1,  0,  0,
				 0,  1,  0,
				 0, -1,  0,
				 1,  0,  0,
				-1,  0,  1,
				 0,  1,  1,
				 0, -1,  1,
				 1,  0,  1
			]),

			color: new Attribute("aColor", program, 4, [
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 0.0, 1.0,
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 0.0, 0.0, 1.0
			]),

			pMatrix: glmat.mat4.create(),
			mvMatrix: glmat.mat4.create(),

			// Uniforms
			uPMatrix: null,
			uMVMatrix: null,
		};

		// Initialize projection and model view matrices
		glmat.mat4.identity(data.pMatrix);
		glmat.mat4.identity(data.mvMatrix);

		data.program = util.initShader(vShader, fShader);
		gl.useProgram(data.program);

		/*
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

		*/

		data.uPMatrix = gl.getUniformLocation(data.program, "uPMatrix");
		data.uMVMatrix = gl.getUniformLocation(data.program, "uMVMatrix");

		gl.enable(gl.DEPTH_TEST);
		return data;
	}
);

