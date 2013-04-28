attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

uniform mat4 uLightVMatrix;
uniform mat4 uLightPMatrix;

varying vec4 vWorldVertex;
varying vec3 vWorldNormal;
varying vec4 vPosition;
varying vec2 vTexture;

void main(void) {
	vWorldVertex = uMMatrix * vec4(aPosition, 1.0);
	vec4 viewVertex = uVMatrix * vWorldVertex;
	gl_Position = uPMatrix * viewVertex;

	vTexture = aTexture;
	vWorldNormal = normalize(mat3(uMMatrix) * aNormal);

	vPosition = uLightPMatrix * uLightVMatrix * vWorldVertex;
}

