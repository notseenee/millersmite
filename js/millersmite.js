"use strict";

// Initialise
var canvas  = document.getElementById('smiteCanvas'),
    ctx     = canvas.getContext('2d'),
    smiteee = document.getElementById('smiteee');

function smite() {
	// UI updates
	document.getElementById('controls').style.display = 'block';
	document.getElementById('initial').style.display = 'none';

	// Add bg
	var bg = document.getElementById('bg');
	ctx.drawImage(bg, 0, 0);

	// Add smiteee
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.rotate(-30*Math.PI/180);
	ctx.globalAlpha = 0.8;

	ctx.drawImage(smiteee, 0, 0);

	// Add Miller
	ctx.restore();
	var miller = document.getElementById('miller');
	ctx.drawImage(miller, 0, 0);

	// Add watermark
	ctx.fillStyle = 'rgba(255,255,255,.5)';
	ctx.textAlign = 'end';
	ctx.textBaseline = 'bottom';
	ctx.font = '57px Mosquifont';
	ctx.fillText('MILLERSMITE.ML', 1000, 1000);
}

// Initial values
var x = 240,
		y = 750,
		scale = 1.00,
		moveable = false,
		baseX, baseY,
		diffX, diffY,
		currentX, currentY;

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    currentX = event.clientX - rect.left;
		currentY = event.clientY - rect.top;

    diffX = baseX - currentX;
    diffY = baseY - currentY;

    baseX = currentX;
    baseY = currentY;

    x -= diffX;
    y -= diffY;

    smite();
}
canvas.onmousedown = function() {
	moveable = true;
	var rect = canvas.getBoundingClientRect();
	baseX = (event.clientX - rect.left);
	baseY = (event.clientY - rect.top);
};
canvas.onmouseup = function() { moveable = false; };
canvas.onmousemove = function() {
	if (moveable) {
		getCursorPosition(canvas, event);
		event.preventDefault();
	}
};

// touch
function getTouchPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    currentX = event.targetTouches[0].clientX - rect.left;
		currentY = event.targetTouches[0].clientY - rect.top;

    diffX = baseX - currentX;
    diffY = baseY - currentY;

    baseX = currentX;
    baseY = currentY;

    x -= diffX;
    y -= diffY;

    smite();
}
canvas.ontouchstart = function() {
	moveable = true;
	var rect = canvas.getBoundingClientRect();
	baseX = (event.targetTouches[0].clientX - rect.left);
	baseY = (event.targetTouches[0].clientY - rect.top);
};
canvas.ontouchend = function() { moveable = false; };
canvas.ontouchmove = function() {
	if (moveable) {
		getTouchPosition(canvas, event);
		event.preventDefault();
	}
};

// Slider
var slider = document.getElementById('scaleSlider'),
		numeric = document.getElementById('scaleNumeric');

// Sync inputs
slider.oninput = function() {
	var rawPercent = parseFloat(slider.value) * 100;
	numeric.value = rawPercent.toFixed(0);
	scale = parseFloat(slider.value);
	smite();
};
numeric.oninput = function() {
	if (numeric.value > 500) numeric.value = 500;
	slider.value = parseFloat(numeric.value) / 100;
	scale = parseFloat(slider.value);
	smite();
};

// touch pinch
var hammer = new Hammer(canvas);
hammer.get('pinch').set({ enable: true });
hammer.on('pinchmove', function(event){

	var scaleLinear = 0.05;

	if (event.scale > 1.00) scale += scaleLinear;
	if (event.scale < 1.00) scale -= scaleLinear;
	
	if (scale > 5.00) scale = 5.00;
	if (scale < 0.01) scale = 0.01;

	console.log('scale: ' + scale);

	slider.value = scale;
	var rawPercent = scale * 100;
	numeric.value = rawPercent.toFixed(0);
	smite();
});

// file input
var upload = document.getElementById('upload');
upload.onchange = function() {
	var fileURL = window.URL.createObjectURL( this.files[0] );
	smiteee.src = fileURL;
	window.URL.revokeObjectURL( this.files[0] );

	setTimeout(function(){ smite(); }, 200);
};

// output
var doneButton = document.getElementById('doneButton'),
		editButton = document.getElementById('editButton'),
		newButton  = document.getElementById('newButton'),
		editor     = document.getElementById('editor'),
		final      = document.getElementById('final'),
		output     = document.getElementById('output');
doneButton.onmouseup = function() {
	editor.style.display = 'none';
	final.style.display = 'block';
	output.src = canvas.toDataURL('image/jpeg', 0.9);
}
editButton.onmouseup = function() {
	editor.style.display = 'block';
	final.style.display = 'none';
}
newButton.onmouseup = function() {
	location.reload();
}
