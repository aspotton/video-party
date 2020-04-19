/**
  Video Party Bookmarklet:
    Create a video call on top of any web page so you can all watch together

  Home:
    https://github.com/aspotton/video-party
**/

var bootstrap_scripts = [
	'https://rtcmulticonnection.herokuapp.com/dist/RTCMultiConnection.min.js',
	'https://rtcmulticonnection.herokuapp.com/socket.io/socket.io.js'
];

bootstrap_web_video_room = function(step) {
	// Finished loading all scripts? Init the app
        if (step > bootstrap_scripts.length - 1) {
		if (!window.VIDEO_ROOM_APP_LOADED) {
			window.VIDEO_ROOM_APP_LOADED = true;
			init_web_video_room();
		}
        }

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = bootstrap_scripts[step];

	var callback = function() {
		step = step + 1;
		bootstrap_web_video_room(step);
	};

	script.onreadystatechange = callback;
	script.onload = callback;

	document.getElementsByTagName('head')[0].appendChild(script);
}

/* Via: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
function generateUUID() { // Public Domain/MIT
	var d = new Date().getTime(); //Timestamp
	var d2 = (performance && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16; //random number between 0 and 16
		if (d > 0){ //Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else { //Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

function toggle_fullscreen_mode() {
	let doc=document,elm=doc.documentElement;
	if      (elm.requestFullscreen      ) { (!doc.fullscreenElement   ? elm.requestFullscreen()       : doc.exitFullscreen()        ) }
	else if (elm.mozRequestFullScreen   ) { (!doc.mozFullScreen       ? elm.mozRequestFullScreen()    : doc.mozCancelFullScreen()   ) }
	else if (elm.msRequestFullscreen    ) { (!doc.msFullscreenElement ? elm.msRequestFullscreen()     : doc.msExitFullscreen()      ) }
	else if (elm.webkitRequestFullscreen) { (!doc.webkitIsFullscreen  ? elm.webkitRequestFullscreen() : doc.webkitCancelFullscreen()) }
	else                                  { console.log("Fullscreen support not detected.");                                          }
}

init_web_video_room = function() {
	var connection = new RTCMultiConnection();
	var room_streams = [];

	function reorder_video_streams() {
		// Order the video streams
		var next_left = 30;
		for (var i=0; i<room_streams.length; i++) {
			if (!room_streams[i].in_original_location)
				continue;

			room_streams[i].style.left = next_left + 'px';
			next_left = next_left + parseInt(room_streams[i].style.width) + 10;
		}
	}

	function drag_start(e) {
		e = e || window.event;
		e.preventDefault();
		element = e.target || e.srcElement;

		element.previous_clientX = e.clientX;
		element.previous_clientY = e.clientY;
		element.previous_onmouseup = document.onmouseup;
		element.previous_onmousemove = document.onmousemove;
		document.onmousemove = drag_move;
		document.onmouseup = drag_stop;
  	}

	function drag_move(e) {
		e = e || window.event;
		e.preventDefault();
		element = e.target || e.srcElement;

		// Not a video element
		if (room_streams.indexOf(element) === -1)
			return;

		// calculate the new cursor position:
		pos1 = element.previous_clientX - e.clientX;
		pos2 = element.previous_clientY - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		element.previous_clientX = e.clientX;
		element.previous_clientY = e.clientY;

		// set the element's new position:
		element.style.top = (element.offsetTop - pos2) + 'px';
		element.style.left = (element.offsetLeft - pos1) + 'px';

		element.in_original_location = false;
	}

	function drag_stop(e) {
		e = e || window.event;
		e.preventDefault();
		element = e.target || e.srcElement;

		document.onmousemove = element.previous_onmousemove;
		document.onmouseup = element.previous_onmouseup;

		reorder_video_streams();
	}

	connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

	connection.session = {
		audio: true,
		video: true,
		data: true
	};

	connection.sdpConstraints.mandatory = {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
	};

	connection.onstream = function(event) {
		var element = event.mediaElement;
		element.style.position = 'fixed';
		element.style.top = '10px';
		element.style.width = '150px';
		element.style.zIndex = '99999999999999';
		element.in_original_location = true;
		element.onmousedown = drag_start;
		element.removeAttribute('controls');

		room_streams.push(element);
		reorder_video_streams();
		document.body.appendChild(element);
	};

	connection.onstreamended = function(event) {
		var element = document.getElementById(event.streamid);

		if (element && element.parentNode) {
			element.parentNode.removeChild(element);
		}

		if (room_streams.indexOf(element) !== -1) {
			room_streams.splice(room_streams.indexOf(element), 1);
		}

		reorder_video_streams();
	};

	var element = document.createElement('div');
	element.style.zIndex = '999999999999';
	element.style.position = 'fixed';
	element.style.top = '10px';
	element.style.left = '10px';
	element.style.height = '10px';
	element.style.width = '10px';
	element.style.backgroundColor = 'green';
	element.onclick = function() {
		toggle_fullscreen_mode();
	}

	var predefined_room_id = prompt('Enter the room ID to join or create. Copy and paste this room name so you can share it with others.', generateUUID());
	if (predefined_room_id !== null) {
		document.body.appendChild(element);
		connection.openOrJoin(predefined_room_id);
	}
}

bootstrap_web_video_room(0);
