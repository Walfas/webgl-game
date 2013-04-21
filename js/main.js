require.config({
	catchError: true,
	baseUrl: "js/src",
	paths: {
		glmatrix: "../lib/gl-matrix-min",
		domReady: "../lib/require/domReady",
		text: "../lib/require/text",
		WebGLDebugUtils: "../lib/webgl-debug"
	}
});

define(["game","texture","terrain"], function(game,texture,terrain) {
	var ta = new texture.TextureAtlas("img/texture.png", 16);
	
	checkLoaded();
	function checkLoaded() {
		if (ta.texture) {
			ta.getST(0);
			var t = new terrain.Terrain(ta);
			t.addBlock(0,[0.5,0.5,0.5],[0,0,0,0,0,1]);
			t.debug();
		}
		else 
			window.setTimeout(checkLoaded, 100);
	}
});

