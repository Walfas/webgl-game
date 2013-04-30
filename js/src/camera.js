define(["glmatrix"], function(glmat) {
	return {
		Camera: function() {
			this.matrix = glmat.mat4.create();
			glmat.mat4.identity(this.matrix);

			this.theta = [1.7*Math.PI, 0.0, 0.5*Math.PI]; // Rotation about X and Z axes
			this.center = [0, 0, 0];
			this.up = [0, 0, 1];
			this.pos = [0, 0, 0];

		
			this.thetaLimits = [1.4*Math.PI, 1.8*Math.PI];
			this.distanceLimits = [2.0, 15.0];
			this.zoomWeight = 0.1;

			this.currentDistance = (this.distanceLimits[0]+this.distanceLimits[1])/2;
			this.desiredDistance = this.currentDistance;

			/** If there is an object between the camera and the center, move
				the camera in front of the blocking object */
			this.checkCollision = function(env) {
				return false; // DEBUG
				for (var d=0.5; d<this.desiredDistance+1.0; d+=0.5) {
					var p = this.sphericalToCartesian(this.center,d,this.theta);
					for (var i=0; i<3; i++)
						p[i] = Math.floor(p[i]);
					// If camera is outside the environment, continue
					if (p[2] < 0 || p[2] >= env.length || 
					    p[1] < 0 || p[1] >= env[p[2]].length ||
					    p[0] < 0 || p[0] >= env[p[2]][p[1]].length)
						continue;

					if (env[p[2]][p[1]][p[0]]) {
						this.currentDistance = d-0.5;
						return true;
					}
				}
				return false;
			}

			this.moveCenter = function(pos, offset) {
				this.center = pos.slice(0);
				if (offset) {
					for (var i=0; i<3; i++)
						this.center[i] += offset[i];
				}
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

			this.updateMatrix = function(env) {
				for (var i=0; i<3; i++) {
					if (this.theta[i] < 0)
						this.theta[i] += 2*Math.PI;
					else if (this.theta[i] > 2*Math.PI)
						this.theta[i] -= 2*Math.PI;
				}
				if (env && !this.checkCollision(env)) {
					this.currentDistance *= 1-this.zoomWeight; 
					this.currentDistance += this.zoomWeight*this.desiredDistance;
				}

				this.pos = this.sphericalToCartesian(this.center, this.currentDistance, this.theta);
				glmat.mat4.lookAt(this.matrix, this.pos, this.center, this.up);
			}
			
			this.updateMatrix();
		}
	};
});

