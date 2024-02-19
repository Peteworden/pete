const pi = Math.PI;

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
if (canvas.height > canvas.width) {
    canvas.height = canvas.width;
}

let date = new Date();

let unit = canvas.width / 80;

function setCanvas(x, y) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#002';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, unit, 0, 2 * pi, false);
    ctx.fill();
    ctx.fillStyle = '#77F';
    ctx.beginPath();
    ctx.arc(canvas.width/2+x, canvas.height/2-y, unit, 0, 2 * pi, false);
    ctx.fill();
}

let x, y, vx, vy, GM, dt, autoFrag=1;
function restart() {
    x = 20 * unit;
    y = 0;
    vx = 0;
    vy = 2*pi*x/15;
    autoFrag = 1;
}
restart();
GM = x*vy*vy;

let pre_x=1000000, pre_y=1000000, pre_t0=0, t0=date.getTime();
canvas.addEventListener("touchstart", ontouchstart);
canvas.addEventListener("touchend", ontouchend);
canvas.addEventListener("mousedown", onmousedown);
canvas.addEventListener("mouseup", onmouseup);

document.getElementById('disc').innerHTML = 'masaru';
function ontouchstart(e) {
    document.getElementById('disc').innerHTML = e.touches.length.toString();
    if (e.touches.length.toString() == '1' && Math.pow(e.touches[0].pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.touches[0].pageY-canvas.offsetTop-canvas.height/2+y, 2) < Math.pow(3*unit, 2)) {
        e.preventdefault();
        autoFrag = 0;
        canvas.addEventListener("ontouchmove", ontouchmove);
    }
}

function ontouchmove(e) {
    var touches = e.changedTouches;
    for (let touch in touches) {
        document.getElementById('disc').innerHTML = touch.pageX + ' ' + touch.pageY;
        if (Math.pow(touch.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(touch.pageY-canvas.offsetTop-canvas.height/2+y, 2) < Math.pow(5*unit, 2)) {
            e.preventdefault();
            date = new Date();
            pre_t0 = t0;
            t0 = date.getTime();
            pre_x = x;
            pre_y = y;
            x = touch.pageX-canvas.offsetLeft-canvas.width/2;
            y = -(touch.pageY-canvas.offsetTop-canvas.height/2);
            document.getElementById('disc').innerHTML = x + ' ' + y;
            setCanvas(x, y);
        }
    }
}

function ontouchend(e) {
    date = new Date();
    vx = (x - pre_x) * 1000 / 20;
    vy = (y - pre_y) * 1000 / 20;
    autoFrag = 1;
    document.getElementById('disc').innerHTML = vx + ' ' + vy;
    canvas.removeEventListener("touchmove", ontouchmove);
    movePlanet();
}

function onmousedown(e){
    if (Math.pow(e.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.pageY-canvas.offsetTop-canvas.height/2+y, 2) < 40*40) {
        autoFrag = 0;
        canvas.addEventListener("mousemove", onmousemove);
    }
}

function onmousemove(e) {
    date = new Date();
    pre_t0 = t0;
    t0 = date.getTime();
    pre_x = x;
    pre_y = y;
    x = e.pageX-canvas.offsetLeft-canvas.width/2;
    y = -(e.pageY-canvas.offsetTop-canvas.height/2);
    setCanvas(x, y);
    document.getElementById('disc').innerHTML = x + ' ' + y;
}

function onmouseup(e) {
    date = new Date();
    vx = (x - pre_x) * 1000 / 20;
    vy = (y - pre_y) * 1000 / 20;
    autoFrag = 1;
    canvas.removeEventListener("mousemove", onmousemove);
    document.getElementById('disc').innerHTML = (x - pre_x) + ' ' +(y - pre_y) + ' ' + (t0 - pre_t0) + ' ' + vx + ' ' + vy;
    movePlanet();
}

function movePlanet() {
    date = new Date();
    dt = (date.getTime() - t0) / 1000;
    t0 = date.getTime();
    vx += -GM * x / Math.pow(x*x + y*y, 1.5) * dt;
    vy += -GM * y / Math.pow(x*x + y*y, 1.5) * dt;
    x  += vx * dt;
    y  += vy * dt;
    if (Math.abs(x) > canvas.width/2 || Math.abs(y) > canvas.height/2) {
        restart();
    }
    setCanvas(x, y);
    if (autoFrag) {
        window.requestAnimationFrame(movePlanet);
    }
}

window.requestAnimationFrame(movePlanet);

document.body.appendChild(canvas);