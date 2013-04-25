define(["glmatrix", "data"], function(glmat, data) {
	return {
		PointLight: function(color, position, attenuation, enabled) {
			this.color = color ? color : [1.0, 1.0, 1.0];
			this.position = position ? position : [0.0, 0.0, 0.0];
			this.attenuation = attenuation ? attenuation : [0.0, 0.1, 0.0];
			this.enabled = enabled ? enabled : true;
		}
	};
});
