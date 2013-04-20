define(function() {
	var input = {
		mouseX: 0,
		mouseY: 0,
		pressedKeys: {}
	};

	document.onkeydown = function(event) {
		input.pressedKeys[event.keyCode] = true;
	}

	document.onkeyup = function(event) {
		input.pressedKeys[event.keyCode] = false;
	}

	/** Disable text selection */
	document.onselectstart = function() {
		return false;
	};

	/** Update mouse position */
	document.onmousemove = function(d) {
		d = d ? d : window.event;
		d.preventDefault();
		input.mouseX = d.clientX;
		input.mouseY = d.clientY;
	}

	return input;
});
