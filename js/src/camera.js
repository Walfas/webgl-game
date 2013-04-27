define(["glmatrix", "data"], function(glmat, data) {
	return {
		Camera: function() {
			this.matrix = glmat.mat4.create();
			glmat.mat4.identity(this.matrix);

			this.theta = [Math.PI/2, 0.0, 0.0]; // Rotation about X and Z axes
			this.center = [0, 0, 0];
			this.currentDistance = 1.0;
			this.desiredDistance = this.currentDistance;
			this.up = [0, 0, 1];

			this.thetaLimits = [-0.6*Math.PI, -0.2*Math.PI];
			this.distanceLimits = [1, 10.0];
			this.zoomWeight = 0.1;

			this.checkCollision = function(env) {
				
			}

			this.moveCenter = function(pos) {
				this.center = pos;
			}

			this.changeAngle = function(dTheta) {
				this.theta[0] -= dTheta[0];
				this.theta[1] -= dTheta[1];
				this.theta[2] -= dTheta[2];
				this.theta[0] = this.theta[0].clamp(this.thetaLimits[0],this.thetaLimits[1]);
			}

			this.setAngle = function(theta) {
				this.theta = theta;
				this.theta[0] = this.theta[0].clamp(this.thetaLimits[0],this.thetaLimits[1]);
			}

			this.changeDistance = function(amount) {
				this.desiredDistance += amount;
				this.desiredDistance = this.desiredDistance.clamp(this.distanceLimits[0],this.distanceLimits[1]);
			}

			this.setDistance = function(dist) {
				this.desiredDistance = dist;
				this.desiredDistance = this.desiredDistance.clamp(this.distanceLimits[0],this.distanceLimits[1]);
			}

			this.sphericalToCartesian = function(origin,r,angles) {
				return [ 
					origin[0] + r * Math.sin(angles[0]) * Math.cos(angles[2]),
					origin[1] + r * Math.sin(angles[0]) * Math.sin(angles[2]),
					origin[2] + r * Math.cos(angles[0])
				];
			}

			this.updateMatrix = function() {
				this.currentDistance *= 1-this.zoomWeight; 
				this.currentDistance += this.zoomWeight*this.desiredDistance;
				var pos = this.sphericalToCartesian(this.center, this.currentDistance, this.theta);
				glmat.mat4.lookAt(this.matrix, pos, this.center, this.up);
			}
			
			this.updateMatrix();
		}
	};
});
