precision mediump float;

varying vec2 vTexture;

uniform sampler2D uSampler;

void main(void) {
	gl_FragColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));
}

