var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var HERO_MOVEMENT = 10;

var lastLoopRun = 0;
var score = 0;
var iterations = 0;

var controller = new Object();
var enemies = new Array();

playAgainButton = document.querySelector('.play');


function createSprite(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

function toggleKey(keyCode, isPressed) {
  if (keyCode == LEFT_KEY) {
    controller.left = isPressed;
  }
  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }
  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }
  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  }
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function ensureBounds(sprite, ignoreY) {
  if (sprite.x < 200) {
    sprite.x = 200;
  }
  if (!ignoreY && sprite.y < 20) {
    sprite.y = 20;
  }
  if (sprite.x + sprite.w > 1060) {
    sprite.x = 1060 - sprite.w;
  }
  if (!ignoreY && sprite.y + sprite.h > 520) {
    sprite.y = 520 - sprite.h;
  }
}

function setPosition(sprite) {
  var e = document.getElementById(sprite.element);
  e.style.left = sprite.x + 'px';
  e.style.top = sprite.y + 'px';
}

function handleControls() {
  if (controller.up) {
    hero.y -= HERO_MOVEMENT;
  }
  if (controller.down) {
    hero.y += HERO_MOVEMENT;
  }
  if (controller.left) {
    hero.x -= HERO_MOVEMENT;
  }
  if (controller.right) {
    hero.x += HERO_MOVEMENT;
  }
  if (controller.space && laser.y <= -120) {
    laser.x = hero.x + 9;
    laser.y = hero.y - laser.h;
  }

  ensureBounds(hero);
}

function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    if (intersects(laser, enemies[i])) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
      laser.y = -laser.h;
      score += 100;
    let sound = document.createElement ('audio');
          sound.src = "audio/laser.mp3";
          document.body.appendChild(sound);

          sound.addEventListener('ended', () => {
          document.body.removeChild(sound);
  })
          sound.play();

    } else if (intersects(hero, enemies[i])) {
      gameOver();
    } else if (enemies[i].y + enemies[i].h >= 560) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
      gameOver();
    }
  }
}


function gameOver() {
  document.getElementById('start').style.display = 'block';

  let explode = document.createElement('audio');
        explode.src = "audio/explosion.mp3";

        document.body.appendChild(explode);

        explode.addEventListener('ended', () => {
          document.body.removeChild(explode);
        });

        explode.loop = false;
        explode.play();

  var element = document.getElementById(hero.element);
  element.style.visibility = 'hidden';
  element = document.getElementById('gameover');
  element.style.visibility = 'visible';


        loop.freeze(addEnemy);

}

function showSprites() {
  setPosition(hero);
  setPosition(laser);
  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }
  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'SCORE: ' + score;
}

function updatePositions() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 4;
    enemies[i].x;
    ensureBounds(enemies[i], true);
  }
  laser.y -= 20;
}

function addEnemy() {
  var interval = 50;
  if (iterations > 1500) {
    interval = 5;
  } else if (iterations > 1000) {
    interval = 20;
  } else if (iterations > 500) {
    interval = 35;
  }

  if (getRandom(interval) == 0) {
    var elementName = 'enemy' + getRandom(10000000);
    var enemy = createSprite(elementName, getRandom(650), -40, 35, 35);

    var element = document.createElement('div');
    element.id = enemy.element;
    element.className = 'enemy';
    document.children[0].appendChild(element);

    enemies[enemies.length] = enemy;
  }
}

function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}

function loop() {
  if (new Date().getTime() - lastLoopRun > 40) {
    updatePositions();
    handleControls();
    checkCollisions();

    addEnemy();

    showSprites();

    lastLoopRun = new Date().getTime();
    iterations++;
  }
  setTimeout('loop();', 2);
}

document.onkeydown = function(evt) {
  toggleKey(evt.keyCode, true);
};

document.onkeyup = function(evt) {
  toggleKey(evt.keyCode, false);
};

var hero = createSprite('hero', 600, 550, 20, 20);
var laser = createSprite('laser', 0, -120, 2, 50);

function playAgain() {
  location.reload();
  }

loop()
 alert("Press Space to shoot!\nPress “←”，“→”，“↑”，“↓” to move! \nENJOY :)");
document.getElementById('start').style.display = 'none';


playAgainButton.addEventListener('click', playAgain);
