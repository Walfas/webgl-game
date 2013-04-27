define(["gl", "glmatrix", "programs", "light"], 
	function(gl, glmat, programs, light){
		var data = programs;

		// Uniform array of PointLight structs in GLSL
		data.world.u.Light = [];
		for (var i=0; i<4; i++) {
			var l = data.world.u.Light;
			l[i] = {};
			for (var key in new light.PointLight()) {
				l[i][key] = gl.getUniformLocation(data.world.program, "uLight["+i+"]."+key);
			}
		}

		data.background = [0.5, 0.5, 0.5, 1.0];
		data.rotateSpeed = 0.01;
		data.rotateLimits = [-0.6*Math.PI, -0.2*Math.PI];
		data.zoomLimits = [0.5, 5.0];

		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);

		gl.useProgram(data.world.program);
		return data;
	}
);

