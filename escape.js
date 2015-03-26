/*
 ** v1
 *************TODO****************
 ** - Nothing.                  **
 *********************************
 */
window.onload = init;

function init() {
    c = document.getElementById("gameCanvas");
    c.width = 720;
    c.height = 500;
    ctx = c.getContext("2d");
    gameLoop();
    setTimeout(function() {
        $("#inst").fadeOut(750);
    }, 3500);
    setInterval(timeLoop, 10);
}
var c, ctx,
    then = Date.now(),
    lost = false,
    keysDown = {};
var player = {
    x: 15,
    y: 15,
    render: function() {
        ctx.fillStyle = "#FF0000"; // red
        ctx.fillRect(player.x, player.y, 10, 10);
    },
    move: function(m) {
        if (37 in keysDown && player.x > 5)
            player.x -= 280 * m;
        if (38 in keysDown && player.y > 5)
            player.y -= 280 * m;
        if (39 in keysDown && player.x < 705)
            player.x += 280 * m;
        if (40 in keysDown && player.y < 485)
            player.y += 280 * m;
    }
};
var enemy = {
    x: 695,
    y: 475,
    speed: 3,
    render: function() {
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillRect(enemy.x, enemy.y, 10, 10);
    },
    move: function() {
        if (enemy.x < player.x)
            enemy.x += enemy.speed;
        if (enemy.x > player.x)
            enemy.x -= enemy.speed;
        if (enemy.y < player.y)
            enemy.y += enemy.speed;
        if (enemy.y > player.y)
            enemy.y -= enemy.speed;
    }
};
var background = {
    color: "#101010",
    render: function() {
        ctx.fillStyle = background.color;
        ctx.fillRect(0, 0, 720, 500);
    }
};

function timeLoop() {
    if (!lost)
        timer.increment();
}
var timer = {
    count: 0,
    increment: function() {
        timer.count++;
    },
    getTime: function(type) {
        return timer.count / 100;
    }
};

function gameLoop() {
    if (!lost) {
        c.height = c.height;
        background.render();
        player.render();
        enemy.render();
        checkCollisions();
        var now = Date.now();
        var delta = now - then;
        player.move(delta / 1000);
        enemy.move();
        then = now;
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillText(fps.get() + " FPS", 680, 15);
        ctx.fillText("Time: " + timer.getTime(), 20, 12);
    } else if (lost) {
        c.height = c.height;
        background.render();
        var message = "You lost! Your time was " + timer.getTime() + " seconds.";
        ctx.font = "normal 32px Verdana";
        ctx.fillStyle = "#0000FF";
        ctx.fillText(message, 125, 250);
        ctx.font = "normal 24px Verdana";
        ctx.fillStyle = "#0000FF";
        ctx.fillText("Press space to play again.", 250, 300);
    }
    window.requestAnimationFrame(gameLoop);
}

function checkCollisions() {
    if (
        player.x <= (enemy.x + 10) &&
        enemy.x <= (player.x + 10) &&
        player.y <= (enemy.y + 10) &&
        enemy.y <= (player.y + 10)
    )
        lose();
}
var fps = {
    startTime: 0,
    frameNumber: 0,
    get: function() {
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = (d - this.startTime) / 1000,
            result = Math.floor((this.frameNumber / currentTime))
        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }
};

function lose() {
    lost = true;
}
addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);
window.onkeypress = function(e) {
    if (e.keyCode == 32)
        window.location.assign(window.location);
};
