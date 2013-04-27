attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform mat4 uLightVMatrix;
uniform mat4 uLightPMatrix;

varying vec4 vWorldVertex;
varying vec3 vWorldNormal;
varying vec3 vViewVec;
varying vec4 vPosition;
varying vec2 vTexture;

void main(void) {
	vWorldVertex = uMMatrix * vec4(aPosition + vec3(-8,-8,-8), 1.0);
	vec4 viewVertex = uVMatrix * vWorldVertex;
	viewVertex += vec4(0,0,-16,0);
	gl_Position = uPMatrix * viewVertex;

	vTexture = aTexture;
	vWorldNormal = normalize(mat3(uMMatrix) * aNormal);
	vViewVec = normalize(-viewVertex.xyz);

	vPosition = uLightPMatrix * uLightVMatrix * vWorldVertex;

	/*
	vPosition = uMVMatrix * vec4(aPosition + vec3(-8,-8,-8), 1.0);
	vPosition += vec4(0,0,-16,0);
	gl_Position = uPMatrix * vPosition;
	vTexture = aTexture;
	vTransformedNormal = uNMatrix * aNormal;
	*/
}

