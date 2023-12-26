var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var spaceship = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 30,
    height: 50,
    dx: 0
  };

window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') spaceship.dx = -2;
    if (e.key === 'ArrowRight') spaceship.dx = 2;
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') spaceship.dx = 0;
});

var asteroids = [];
for (var i = 0; i < 15; i++) {
  asteroids.push({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    radius: Math.random() * 20 + 15,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 + 1
  });
}

var background = new Image();
background.src = 'space.jpg';

ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

var startTime = Date.now();


var bullets = [];
var lastShotTime = 0;
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        var currentTime = Date.now();
        if (currentTime - lastShotTime >= 500) {
            var bullet = {
                x: spaceship.x + spaceship.width / 2, 
                y: spaceship.y,
                dy: -2
            };
            bullets.push(bullet);
            lastShotTime = currentTime;
        }
    }
});

function gameLoop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    spaceship.x += spaceship.dx;
    ctx.fillStyle = 'blue';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    bullets.forEach(function(bullet, index) {
        bullet.y += bullet.dy;

        asteroids.forEach(function(asteroid, asteroidIndex) {
            var dx = bullet.x - asteroid.x;
            var dy = bullet.y - asteroid.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.radius) {
                bullets.splice(index, 1);
                asteroid.y = Math.random() * -canvas.height;
                asteroid.x = Math.random() * canvas.width;
                return;
            }
        });

    if (bullet.y < 0) {
        bullets.splice(index, 1);
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect(bullet.x, bullet.y, 2, 10);
    });

    asteroids.forEach(function(asteroid) {
        asteroid.y += asteroid.dy;
        asteroid.x += asteroid.dx;
        
        if (asteroid.y - asteroid.radius > canvas.height) {
            asteroid.y = Math.random() * -canvas.height;
            asteroid.x = Math.random() * canvas.width;
        }

        var dx = spaceship.x - asteroid.x;
        var dy = spaceship.y - asteroid.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (doesOverlap(spaceship, asteroid)) {
            var elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            alert('You lasted ' + elapsedTime + ' seconds. Click OK to restart the game.');
            location.reload();

            spaceship.x = canvas.width / 2;
            spaceship.y = canvas.height - 30;
            spaceship.dx = 0;

            asteroids.forEach(function(asteroid) {
                asteroid.x = Math.random() * canvas.width;
                asteroid.y = Math.random() * -canvas.height;
                asteroid.dx = Math.random() * 2 - 1;
                asteroid.dy = Math.random() * 2 + 1;
            });
        }
        var grayValue = Math.floor(255 * (1 - asteroid.radius / 35));
        ctx.fillStyle = 'rgb(' + grayValue + ', ' + grayValue + ', ' + grayValue + ')';
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();
      });

    requestAnimationFrame(gameLoop);
}


gameLoop();

function doesOverlap(rectangle, circle) {
    var rectX = rectangle.x;
    var rectY = rectangle.y;
    var rectWidth = rectangle.width;
    var rectHeight = rectangle.height;

    var circleX = circle.x;
    var circleY = circle.y;
    var circleRadius = circle.radius;

    var distX = Math.abs(circleX - rectX - rectWidth / 2);
    var distY = Math.abs(circleY - rectY - rectHeight / 2);

    if (distX > (rectWidth / 2 + circleRadius)) { return false; }
    if (distY > (rectHeight / 2 + circleRadius)) { return false; }

    if (distX <= (rectWidth / 2)) { return true; }
    if (distY <= (rectHeight / 2)) { return true; }

    var dx = distX - rectWidth / 2;
    var dy = distY - rectHeight / 2;
    return (dx * dx + dy * dy <= (circleRadius * circleRadius));
}
