/*
 ** v8
 *************TODO****************
 ** - This has been moved to the** 
 **  GitHub repository's TODO.md**
 *********************************
 */
window.onload = init; // called when all everything is ready

function init() {
    c = document.getElementById("gameCanvas"); // gets canvas
    c.width = cWidth; // sets dimensions
    c.height = cHeight; // ^
    ctx = c.getContext("2d"); // gets 2D context
    gameLoop(); // calls main loop
    setTimeout(function() { // hides instructions
        $("#inst").fadeOut(750);
    }, 3500);
    setInterval(timeLoop, 10); // timer loop
}
var c, ctx, // misc vars
    then = Date.now(),
    lost = false,
    keysDown = {},
    cWidth = 720,
    cHeight = 500;
var player = {
    x: 15, // player x position
    y: 15, // player y position
    render: function() { // renders player
        ctx.fillStyle = "#FF0000"; // red
        ctx.fillRect(player.x, player.y, 10, 10);
    },
    move: function(m) { // moves player, while keeping them from leaving.
        if (37 in keysDown && player.x > 5)
            player.x -= 280 * m;
        if (38 in keysDown && player.y > 5)
            player.y -= 280 * m;
        if (39 in keysDown && player.x < cWidth - 15)
            player.x += 280 * m;
        if (40 in keysDown && player.y < cHeight - 15)
            player.y += 280 * m;
    }
};
var enemy = {
    x: cWidth - 25, // enemy x position
    y: cHeight - 25, // enemy y position
    speed: 3, // enemy speed
    render: function() { // renders enemy
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillRect(enemy.x, enemy.y, 10, 10);
    },
    move: function() { // moves enemy towards player
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
    color: "#101010", // dark dark dark gray
    render: function() { // renders background
        ctx.fillStyle = background.color;
        ctx.fillRect(0, 0, cWidth, cHeight);
    }
};

function timeLoop() { // if player hasn't lost, increment timer.
    if (!lost)
        timer.increment();
}
var timer = {
    count: 0, // timer count
    increment: function() {
        timer.count++;
    },
    getTime: function(type) {
        return timer.count / 100; // timer count is actually hundredths of a second. This displays it as x.xx
    }
};

function gameLoop() { // main game loop
    if (!lost) { // if player hasn't lost
        c.height = c.height; // clears canvas
        background.render(); // renders background
        player.render(); // renders player
        enemy.render(); // renders enemy
        checkCollisions(); // checks for collisions between player and enemy
        var now = Date.now(); // time delta stuff used for player movement
        var delta = now - then; // ^
        player.move(delta / 1000); // player movement
        enemy.move(); // enemy movement
        then = now; // more time deltas
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillText(fps.get() + " FPS", cWidth - 40, 15); // displays FPS
        ctx.fillText("Time: " + timer.getTime(), 20, 12); // displays player time
    } else if (lost) { // if player lost
        c.height = c.height; // clears canvas
        background.render(); // renders background
        var time = timer.getTime();
        if (time >= 60) {
            time /= 60;
            time += " minutes.";
        }
        else if (time < 60) {
            time += " seconds.";
        }
        var message = "You lost! You survived for " + time; // loss message
        ctx.font = "normal 32px Verdana"; // sets font
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillText(message, 50, 250); // displays message
        ctx.font = "normal 24px Verdana"; // sets font
        ctx.fillStyle = "#0000FF"; // blue
        ctx.fillText("Press space to play again.", 200, 300); // displays message
    }
    window.requestAnimationFrame(gameLoop); // does it all again
}

function checkCollisions() { // checks for collisions between player and enemy
    if (
        player.x <= (enemy.x + 10) &&
        enemy.x <= (player.x + 10) &&
        player.y <= (enemy.y + 10) &&
        enemy.y <= (player.y + 10)
    )
        lose();
}
var fps = { // FPS counter. I did not write this, I found it at http://www.html5gamedevs.com/topic/1828-how-to-calculate-fps-in-plain-javascript/
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

function lose() { // I think it is obvious what this does.
    lost = true;
}
addEventListener("keydown", function(e) { // on keydown, add pressed key to keysDown
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) { // on keyup, removes pressed key from keysDown
    delete keysDown[e.keyCode];
}, false);
window.onkeypress = function(e) { // checks for player pressing space; if so, reload the page.
    if (e.keyCode == 32)
        window.location.assign(window.location);
};
