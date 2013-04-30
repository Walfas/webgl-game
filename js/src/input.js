define(["canvas"], function(canvas) {
	var input = {
		mouse: [0,0],
		mouseMove: [0,0],
		pressedKeys: {},
		leftClick: false,
		rightClick: false,
		scroll: 0,
	};

	canvas.onmousedown = function(event) {
		if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			input.leftClick = event.which == 1; 
			input.rightClick = event.which == 3; 
		}
		else if ("button" in event) {  // IE, Opera 
			input.leftClick = event.button == 1; 
			input.rightClick = event.button == 2; 
		}
	}

	canvas.onmouseup = function(event) {
		if ("which" in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
			input.leftClick = event.which == 1 ? false : input.leftClick; 
			input.rightClick = event.which == 3 ? false : input.rightClick; 
		}
		else if ("button" in event) {  // IE, Opera 
			input.leftClick = event.button == 1 ? false : input.leftClick; 
			input.rightClick = event.button == 2 ? false : input.leftClick; 
		}
	}

	var mousewheelevent=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
	if (document.attachEvent) //if IE (and Opera depending on user setting)
		document.attachEvent("on"+mousewheelevent, mousewheel)
	else if (document.addEventListener) //WC3 browsers
		document.addEventListener(mousewheelevent, mousewheel, false)

	function mousewheel(e) {
		var event = window.event || e;
		input.scroll = event.detail ? -event.detail : event.wheelDelta;
	}

	document.onkeydown = function(event) {
		input.pressedKeys[event.keyCode] = true;
	}

	document.onkeyup = function(event) {
		input.pressedKeys[event.keyCode] = false;
	}

	/** Disable text selection */
	canvas.onselectstart = function() {
		return false;
	};

	/** Update mouse position */
	canvas.onmousemove = function(d) {
		d = d ? d : window.event;
		d.preventDefault();
		input.mouseMove = [d.clientX - input.mouse[0], d.clientY - input.mouse[1]];
		input.mouse = [d.clientX, d.clientY];
	}

	return input;
});
