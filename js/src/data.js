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

		function Index(program, values) {
			this.values = values;

			this.bufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferObject);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(values), gl.STATIC_DRAW);

			this.numElements = function() {
				return this.values.length;
			}
		}

		var data = {
			program: program,
			background: [0.5, 0.5, 0.5, 1.0],

			cube: util.makeBox(),

	/*
			vertices: new Attribute("aPosition", program, 3, [
				// Front face
				-0.5, -0.5,  0.5,
				 0.5, -0.5,  0.5,
				 0.5,  0.5,  0.5,
				-0.5,  0.5,  0.5,
				
				// Back face
				-0.5, -0.5, -0.5,
				-0.5,  0.5, -0.5,
				 0.5,  0.5, -0.5,
				 0.5, -0.5, -0.5,
				
				// Top face
				-0.5,  0.5, -0.5,
				-0.5,  0.5,  0.5,
				 0.5,  0.5,  0.5,
				 0.5,  0.5, -0.5,
				
				// Bottom face
				-0.5, -0.5, -0.5,
				 0.5, -0.5, -0.5,
				 0.5, -0.5,  0.5,
				-0.5, -0.5,  0.5,
				
				// Right face
				 0.5, -0.5, -0.5,
				 0.5,  0.5, -0.5,
				 0.5,  0.5,  0.5,
				 0.5, -0.5,  0.5,
				
				// Left face
				-0.5, -0.5, -0.5,
				-0.5, -0.5,  0.5,
				-0.5,  0.5,  0.5,
				-0.5,  0.5, -0.5,
			]),

			vertexIndices: new Index(program, [
				 0,  1,  2,    0,  2,  3,  // Front face
				 4,  5,  6,    4,  6,  7,  // Back face
				 8,  9, 10,    8, 10, 11,  // Top face
				12, 13, 14,   12, 14, 15,  // Bottom face
				16, 17, 18,   16, 18, 19,  // Right face
				20, 21, 22,   20, 22, 23   // Left face
			]),
*/

			pMatrix: glmat.mat4.create(),
			mvMatrix: glmat.mat4.create(),

			// Uniforms
			uPMatrix: null,
			uMVMatrix: null,
		};

		data.cube.attribLocation = gl.getAttribLocation(program, "aPosition");
		gl.enableVertexAttribArray(data.cube.attribLocation);

		// Initialize projection and model view matrices
		glmat.mat4.identity(data.pMatrix);
		glmat.mat4.identity(data.mvMatrix);

		data.program = util.initShader(vShader, fShader);
		gl.useProgram(data.program);

		data.uPMatrix = gl.getUniformLocation(data.program, "uPMatrix");
		data.uMVMatrix = gl.getUniformLocation(data.program, "uMVMatrix");

		gl.enable(gl.DEPTH_TEST);
		return data;
	}
);

