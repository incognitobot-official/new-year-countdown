const targetDate = new Date('2024-12-31T23:59:59').getTime();

const nextYear = new Date().getFullYear() + 1;
document.getElementById('until').textContent = `until `;
document.getElementById('next-year').textContent = `${nextYear}`;

let prevDays = 0;
let prevHours = 0;
let prevMinutes = 0;
let prevSeconds = 0;

function updateCountdown() {
  const now = new Date().getTime();
  const timeLeft = targetDate - now;

  if (timeLeft < 0) {
    document.getElementById('countdown-timer').textContent = "Time's up!";
    return;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Only animate if the value has changed
  if (days !== prevDays) {
    updateElement('days', `${days} days`);
    prevDays = days;
  }
  if (hours !== prevHours) {
    updateElement('hours', `${hours} hours`);
    prevHours = hours;
  }
  if (minutes !== prevMinutes) {
    updateElement('minutes', `${minutes} mins`);
    prevMinutes = minutes;
  }
  if (seconds !== prevSeconds) {
    updateElement('seconds', `${seconds} secs`);
    prevSeconds = seconds;
  }
}

function updateElement(id, text) {
  const element = document.getElementById(id);
  element.classList.remove('fadeOutInText'); // Remove the animation class
  void element.offsetWidth; // Trigger reflow
  element.textContent = text;
  element.classList.add('fadeOutInText'); // Add the animation class
}

setInterval(updateCountdown, 1000);


window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();

var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
		cw = window.innerWidth,
		ch = window.innerHeight,
		fireworks = [],
		particles = [],
		hue = 120,
		limiterTotal = 5,
		limiterTick = 0,
		timerTotal = 80,
		timerTick = 0,
		mousedown = false,
		mx,
		my;
		
canvas.width = cw;
canvas.height = ch;

function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

function Firework( sx, sy, tx, ty ) {
	this.x = sx;
	this.y = sy;
	this.sx = sx;
	this.sy = sy;
	this.tx = tx;
	this.ty = ty;
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	this.coordinates = [];
	this.coordinateCount = 3;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 2;
	this.acceleration = 1.05;
	this.brightness = random( 50, 70 );
	this.targetRadius = 1;
}

Firework.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}
	
	this.speed *= this.acceleration;
	
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );
	
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		fireworks.splice( index, 1 );
	} else {
		this.x += vx;
		this.y += vy;
	}
}

Firework.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}

function Particle( x, y ) {
	this.x = x;
	this.y = y;
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	this.friction = 0.95;
	this.gravity = 1;
	this.hue = random( hue - 50, hue + 50 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	this.decay = random( 0.015, 0.03 );
}

Particle.prototype.update = function( index ) {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

Particle.prototype.draw = function() {
	ctx. beginPath();
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}

function createParticles( x, y ) {
	var particleCount = 30;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

function loop() {
	requestAnimFrame( loop );
	
	hue= random(0, 360 );
	
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	ctx.globalCompositeOperation = 'lighter';
	
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}
	
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );
	}
	
	if( limiterTick >= limiterTotal ) {
		if( mousedown ) {
			fireworks.push( new Firework( cw / 2, ch, mx, my ) );
			limiterTick = -5;
		}
	} else {
		limiterTick++;
	}
}

canvas.addEventListener( 'mousemove', function( e ) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener( 'mousedown', function( e ) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});

window.onload = loop;



document.addEventListener("DOMContentLoaded", () => {
  // Font Picker
  const fontPicker = document.getElementById("font-picker");
  fontPicker.addEventListener("change", (e) => {
    document.body.style.fontFamily = e.target.value;
  });

  // Background Picker
  const backgroundPicker = document.getElementById("background-picker");
  backgroundPicker.addEventListener("change", (e) => {
    document.body.style.backgroundImage = `url('assets/${e.target.value}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  });

  // Light/Dark Mode Toggle
  const toggleButton = document.getElementById("toggle-light-dark");
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    toggleButton.classList.toggle("light");
  });
});
