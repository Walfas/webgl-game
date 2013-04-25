define(["glmatrix", "data"], function(glmat, data) {
	return {
		PointLight: function() {
			this.enabled = true;
			this.color = [1.0, 1.0, 1.0];
			this.position = [0.0, 0.0, 0.0];
		},

		DepthShader: function() {
			
		}
	};
});
