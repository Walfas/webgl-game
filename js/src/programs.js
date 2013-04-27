define([
	"gl", "glmatrix",
	"text!shaders/world.vs", "text!shaders/world.fs", 
	"text!shaders/depth.vs", "text!shaders/depth.fs"
	], 
	function(gl, glmat, worldV, worldF, depthV, depthF) {
		/** Returns compiled shader */
		this.getShader = function(type, text) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, text);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw (type == gl.VERTEX_SHADER ? "Vertex" : "Fragment")
					+ " failed to compile:\n\n" 
					+ gl.getShaderInfoLog(shader);
			}

			return shader;
		}

		/** Assigns shaders to program and returns the program */
		this.initShader = function(vertexShaderText, fragmentShaderText) {
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, this.getShader(gl.VERTEX_SHADER, vertexShaderText));
			gl.attachShader(shaderProgram, this.getShader(gl.FRAGMENT_SHADER, fragmentShaderText));
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
				throw new Error("Could not initialize shaders");

			return shaderProgram;
		}
		
		this.newProgram = function(vs, fs, att, uni, mats) {
			var glProgram = this.initShader(vs,fs);
			var p = {
				program: glProgram,
				a: {},
				u: {},
				m: {}
			};
			// Set attributes
			for (var i=0; i<att.length; i++) 
				p.a[att[i]] = gl.getAttribLocation(glProgram, "a"+att[i]);

			// Set uniforms
			for (var i=0; i<uni.length; i++) 
				p.u[uni[i]] = gl.getUniformLocation(glProgram, "u"+uni[i]);

			// Initialize matrices
			for (var prop in mats) {
				var size = mats[prop];
				var mat;
				switch(size) {
				case 2: mat = glmat.mat2; break;
				case 3: mat = glmat.mat3; break;
				case 4: mat = glmat.mat4; break;
				default: console.log("Invalid matrix size");
				}
				p.m[prop] = mat.create();
				mat.identity(p.m[prop]);
			}
			return p;
		}

		return {
			world: this.newProgram(
				worldV, worldF, 
				[
					"Position", 
					"Texture", 
					"Normal"
				],
				[
					"NMatrix", 
					"PMatrix", 
					"MMatrix", 
					"VMatrix", 
					"Sampler", 
					"LightVMatrix", 
					"LightPMatrix", 
					"AmbientColor", 
					"DepthMap", 
					"Light"
				],
				{
					pMatrix: 4,
					mMatrix: 4,
					vMatrix: 4,
					nMatrix: 3
				}
			),
			depth: this.newProgram(
				depthV, depthF,
				[
					"Position"
				],
				[
					"PMatrix", 
					"NMatrix", 
					"MMatrix", 
				],
				{
					pMatrix: 4,
					mMatrix: 4,
					vMatrix: 4
				}
			)
		};

	}
);


