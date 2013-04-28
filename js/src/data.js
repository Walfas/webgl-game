define(["gl", "glmatrix", "programs", "light"], 
	function(gl, glmat, programs, light){
		var data = programs;

		// Uniform array of PointLight structs in GLSL
		setLightUniforms(data.world);
		setLightUniforms(data.sprites);

		data.background = [0.5, 0.5, 0.5, 1.0];
		data.rotateSpeed = 0.01;

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);

		gl.useProgram(data.world.program);
		return data;

		function setLightUniforms(prog) {
			// Uniform array of PointLight structs in GLSL
			prog.u.Light = [];
			for (var i=0; i<4; i++) {
				var l = prog.u.Light;
				l[i] = {};
				for (var key in new light.PointLight()) {
					l[i][key] = gl.getUniformLocation(prog.program, "uLight["+i+"]."+key);
				}
			}
		}
	}
);

