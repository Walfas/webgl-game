#define M_PI 3.1415926535897932384626433832795

attribute vec3 aPosition;
attribute vec3 aOffset;
attribute vec2 aTexture;
attribute float aMoving;
attribute float aFlipped;

uniform vec3 uCamPos;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform float uCounter;

varying vec4 vWorldVertex;
varying vec3 vWorldNormal;
varying vec4 vPosition;
varying vec2 vTexture;

const vec3 camUp = vec3(0.0, 0.0, 1.0);

void main(void) {
	// Billboarding
	vec3 look = normalize(uCamPos - aPosition);
	vec3 right = normalize(cross(camUp, look));
	vec3 up = normalize(cross(look, right));

	vec3 offset = aOffset;
	if (aMoving > 0.5 && offset.z < 0.5) {
		// Walking wobble animation
		float t = mod(1.5*uCounter/M_PI,2.0*M_PI);
		t = (abs(t-M_PI)-0.5*M_PI)*0.25;
		float x = offset.x;
		float z = offset.z;
		float c = cos(t);
		float s = sin(t);
		offset.x = x*c - z*s;
		offset.z = x*s + z*c;
		if (x < 0.0)
			offset.z *= 0.70;
	}
	else {
		// Idle wobble animation
		float t = mod(uCounter/M_PI,2.0*M_PI);

		vec3 mult = vec3(0.05, 0.0, 0.13);
		if (offset.x < 0.0)
			mult.x *= -1.0;
		if (offset.z > 0.5)
			mult.z *= -1.0;
		else
			mult.z = 0.0;

		offset.x += sin(t)*mult.x;
		offset.z += cos(t)*mult.z;
	}
	if (aFlipped > 0.5)
		offset.x *= -1.0;

	// Thanks to http://www.gamedev.net/topic/385785-billboard-shader/#entry3550648
	vec3 vR = offset.x*right;
	vec3 vU = offset.z*up;
	vec4 d = vec4(vR+vU+look*0.5, 0.0);
	vPosition = vWorldVertex =  uMMatrix * (vec4(aPosition, 1.0) + d);

	vWorldNormal = look;
	vTexture = aTexture;

	gl_Position = uPMatrix * uVMatrix * vWorldVertex;
}

