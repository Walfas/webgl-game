precision mediump float;

varying vec2 vTexture;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;
uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingColor;

void main(void) {
	vec4 fragmentColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));
	if (fragmentColor.a < 0.1) // Transparent textures
		discard;

	vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;

	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);	
}

