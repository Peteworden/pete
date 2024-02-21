const pi = Math.PI;

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
if (canvas.height > canvas.width) {
    canvas.height = canvas.width;
}

let date = new Date();

let unit = Math.min(canvas.width, canvas.height) / 80;

var a=0, ecc=0, theta0=0, rot=1;

function setCanvas(x, y) {
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


let x, y, r, vx, vy, v, theta=0, GM, dt, autoFrag=1;
function restart() {
    x = 20 * unit;
    y = 0;
    r = Math.sqrt(x*x+y*y);
    vx = 0;
    vy = 2*pi*x/15;
    v = Math.sqrt(vx*vx+vy*vy);
    theta = 0;
    a = x;
    ecc = 0;
    theta0 = 0;
    rot = 1;
    autoFrag = 1;
}
restart();
GM = r*v*v;

let pre_x=0, pre_y=0, pre_t0=0, t0=date.getTime();

canvas.addEventListener("touchstart", ontouchstart);
canvas.addEventListener("mousedown", onmousedown);

function ontouchstart(e) {
    if (e.touches.length.toString() == '1' && Math.pow(e.touches[0].pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.touches[0].pageY-canvas.offsetTop-canvas.height/2+y, 2) < Math.pow(3*unit, 2)) {
        e.preventDefault();
        autoFrag = 0;
        canvas.addEventListener("touchmove", ontouchmove);
        canvas.addEventListener("touchend", ontouchend);
    }
}

function ontouchmove(e) {
    var touches = e.changedTouches;
    let touch, i
    for (i=0; i<touches.length; i++) {
        touch = touches[i];
        if (Math.pow(touch.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(touch.pageY-canvas.offsetTop-canvas.height/2+y, 2) < Math.pow(5*unit, 2)) {
            e.preventDefault();
            date = new Date();
            pre_t0 = t0;
            t0 = date.getTime();
            pre_x = x;
            pre_y = y;
            x = touch.pageX-canvas.offsetLeft-canvas.width/2;
            y = -(touch.pageY-canvas.offsetTop-canvas.height/2);
            setCanvas(x, y);
        }
    }
}

function ontouchend(e) {
    date = new Date();
    vx = (x - pre_x) * 1000 / 20;
    vy = (y - pre_y) * 1000 / 20;
    autoFrag = 1;
    r = Math.sqrt(x*x + y*y);
    v = Math.sqrt(vx*vx + vy*vy);

    if (r <= 0 || v <= 0) {
        theta = 0;
    } else {
        theta = Math.acos((x*vx+y*vy)/r/v);
    }

    if (1 + r*v*v/GM * (r*v*v/GM - 2) * Math.pow(Math.sin(theta), 2) >= 0) {
        ecc = Math.sqrt(1 + r*v*v/GM * (r*v*v/GM - 2) * Math.pow(Math.sin(theta), 2));
    } else {
        ecc = 100;
    }

    if (ecc == 0) {
        a = r;
    } else {
        a = Math.pow(r*v*Math.sin(theta), 2) / ecc / GM;
    }

    rot = Math.sign(x * vy - y * vx); //反時計回りが1、時計回りが-1

    if (x*vx+y*vy>0) {
        theta0 = Math.atan2(y, x) - rot * Math.acos(a/r - 1/ecc);
    } else {
        theta0 = Math.atan2(y, x) + rot * Math.acos(a/r - 1/ecc);
    }

    canvas.removeEventListener("touchmove", ontouchmove);
    canvas.removeEventListener("touchend", ontouchend);
    movePlanet();
}

function onmousedown(e){
    if (Math.pow(e.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.pageY-canvas.offsetTop-canvas.height/2+y, 2) < 40*40) {
        autoFrag = 0;
        canvas.addEventListener("mousemove", onmousemove);
        canvas.addEventListener("mouseup", onmouseup);
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
}

function onmouseup(e) {
    date = new Date();
    vx = (x - pre_x) * 1000 / 20;
    vy = (y - pre_y) * 1000 / 20;
    autoFrag = 1;
    r = Math.sqrt(x*x + y*y);
    v = Math.sqrt(vx*vx + vy*vy);

    if (r <= 0 || v <= 0) {
        theta = 0;
    } else {
        theta = Math.acos((x*vx+y*vy)/r/v);
    }

    if (1 + r*v*v/GM * (r*v*v/GM - 2) * Math.pow(Math.sin(theta), 2) >= 0) {
        ecc = Math.sqrt(1 + r*v*v/GM * (r*v*v/GM - 2) * Math.pow(Math.sin(theta), 2));
    } else {
        ecc = 100;
    }

    if (ecc == 0) {
        a = r;
    } else {
        a = Math.pow(r*v*Math.sin(theta), 2) / ecc / GM;
    }

    rot = Math.sign(x * vy - y * vx); //反時計回りが1、時計回りが-1

    if (x*vx+y*vy>0) {
        theta0 = Math.atan2(y, x) - rot * Math.acos(a/r - 1/ecc);
    } else {
        theta0 = Math.atan2(y, x) + rot * Math.acos(a/r - 1/ecc);
    }

    canvas.removeEventListener("mousemove", onmousemove);
    canvas.removeEventListener("mouseup", onmouseup);
    movePlanet();
}

function eom(x, y, vx, vy) {
    let x1, y1, vx1, vy1;
    x1 = vx;
    y1 = vy;
    vx1 = -GM * x / Math.pow(x*x + y*y, 1.5);
    vy1 = -GM * y / Math.pow(x*x + y*y, 1.5);
    return [x1 * dt, y1 * dt, vx1 * dt, vy1 * dt];
}

function movePlanet() {
    let k1 = [], k2 = [], k3 = [], k4 = [];
    date = new Date();
    dt = (date.getTime() - t0) / 1000;
    t0 = date.getTime();
    k1 = eom(x, y, vx, vy);
    k2 = eom(x + k1[0] / 2, y + k1[1] / 2, vx + k1[2] / 2, vy + k1[3] / 2);
    k3 = eom(x + k2[0] / 2, y + k2[1] / 2, vx + k2[2] / 2, vy + k2[3] / 2);
    k4 = eom(x + k3[0], y + k3[1], vx + k3[2], vy + k3[3]);
    x += (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
    y += (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    vx += (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]) / 6;
    vy += (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]) / 6;
    if (Math.abs(x) > canvas.width/2 || Math.abs(y) > canvas.height/2) {
        restart();
    }
    setCanvas(x, y);
    drawOrbit();
    if (autoFrag) {
        window.requestAnimationFrame(movePlanet);
    }
}

window.requestAnimationFrame(movePlanet);

function drawOrbit() {
    var ang, dist;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    for (var t=0; t<100; t++) {
        ang = theta0 + rot * 2 * pi * t / 100;
        if (ecc == 0) {
            dist = a;
        } else {
            dist = a * ecc / (1 + ecc * Math.cos(2*pi*t/100));
        }
        if (dist > 0) {
            ctx.beginPath();
            ctx.arc(canvas.width/2+dist*Math.cos(ang), canvas.height/2-dist*Math.sin(ang), 1, 0, 2*pi, false);
            ctx.fill();
        }
    }
}

document.body.appendChild(canvas);
