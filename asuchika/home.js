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

const x0 = 20*unit;
const vy0 = 2*pi*x0/15;
var a=0, ecc2=0, ecc=0, theta0=0, rot=1, M0=0;
var x=x0, y=0, r=x0, vx=0, vy, v, theta=0, ang, V=0, E=0, M=0;
var time, dt, autoFrag=1;
var prepre_x=x, prepre_y=y, prepre_t0=date.getTime(), pre_x=x, pre_y=y, pre_t0=date.getTime(), t0=date.getTime();

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

function restart() {
    x = x0;
    y = 0;
    r = Math.sqrt(x*x+y*y);
    vx = 0;
    vy = vy0;
    v = Math.sqrt(vx*vx+vy*vy);
    theta = pi/2;
    ang = 0
    V = 0;
    E = 0;
    M = 0;
    a = x;
    ecc = 0;
    theta0 = 0;
    M0 = 0;
    rot = 1;
    prepre_x = x;
    prepre_y = y;
    prepre_t0 = date.getTime();
    pre_x = x;
    pre_y = y;
    pre_t0 = date.getTime();
    t0 = date.getTime();
    autoFrag = 1;
    document.getElementById('orbitInfo').innerHTML = '円<br>軌道半径 ' + Math.round(a*10)/10 + '　離心率 ' + Math.round(ecc*100)/100 + '　周期 ' + Math.round(2*pi*a/vy*10)/10 + '秒';
    document.getElementById('positionInfo').innerHTML = '太陽からの距離 ' + Math.round(r*10)/10;
    return [x, y, vx, vy];
}
restart();
const GM = r*v*v;

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
            prepre_t0 = pre_t0;
            pre_t0 = t0;
            t0 = date.getTime();
            prepre_x = pre_x;
            prepre_y = pre_y;
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
    vx = (x - prepre_x) * 1000 / (date.getTime() - prepre_t0);
    vy = (y - prepre_y) * 1000 / (date.getTime() - prepre_t0);
    t0 = date.getTime();
    autoFrag = 1;
    calcOrbit(x, y, vx, vy);
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
    prepre_t0 = pre_t0;
    pre_t0 = t0;
    t0 = date.getTime();
    prepre_x = pre_x;
    prepre_y = pre_y;
    pre_x = x;
    pre_y = y;
    x = e.pageX-canvas.offsetLeft-canvas.width/2;
    y = -(e.pageY-canvas.offsetTop-canvas.height/2);
    setCanvas(x, y);
}

function onmouseup(e) {
    date = new Date();
    vx = (x - prepre_x) * 1000 / (date.getTime() - prepre_t0);
    vy = (y - prepre_y) * 1000 / (date.getTime() - prepre_t0);
    t0 = date.getTime();
    autoFrag = 1;
    calcOrbit(x, y, vx, vy);
    canvas.removeEventListener("mousemove", onmousemove);
    canvas.removeEventListener("mouseup", onmouseup);
    movePlanet();
}

function calcOrbit(x, y, vx, vy) {
    r = Math.sqrt(x*x + y*y);
    v = Math.sqrt(vx*vx + vy*vy);
    if (v == 0) {
        [x, y, vx, vy] = restart();
    }
    ang = Math.atan2(y, x);
    if (r <= 0 || v <= 0) {
        theta = 0;
    } else {
        theta = Math.acos((x*vx+y*vy)/r/v);
    }
    ecc2 = 1 + r*v*v/GM * (r*v*v/GM - 2) * Math.pow(Math.sin(theta), 2);
    if (ecc2 >= 0) {
        ecc = Math.sqrt(ecc2);
    } else {
        ecc = 100;
    }
    if (ecc == 0) {
        a = r;
    } else if (ecc == 1) {
        ecc = 0.99999999
        a = 10000000000;
    } else {
        a = Math.pow(r*v*Math.sin(theta), 2) / (1-ecc*ecc) / GM;
    }
    rot = Math.sign(x * vy - y * vx); //反時計回りが1、時計回りが-1
    if (ecc <= 0) {
        theta0 = ang;
    } else {
        theta0 = ang - Math.sign(x*vx+y*vy) * rot * Math.acos((1-ecc*ecc)*a/r/ecc - 1/ecc);
    }
    if (ecc < 1) {
        E = 2 * Math.atan(Math.sqrt((1-ecc)/(1+ecc)) * Math.tan(rot*(ang-theta0)/2));
        M0 = E - ecc * Math.sin(E);
    } else if (1 < ecc) {
        var s = (-rot*r*Math.sin(ang-theta0) - Math.sqrt(Math.pow(r*Math.sin(ang-theta0), 2) + a*a*(ecc*ecc-1))) / a / Math.sqrt(ecc*ecc-1);
        M0 = ecc * 0.5 * (s - 1/s) - Math.log(s);
    }
    if (ecc == 0) {
        document.getElementById('orbitInfo').innerHTML = '円<br>軌道半径 ' + Math.round(a*10)/10 + '　離心率 ' + Math.round(ecc*100)/100 + '　周期 ' + Math.round(2*pi*Math.sqrt(a*a*a/GM)*10)/10 + '秒';
    } else if (ecc < 0.99) {
        document.getElementById('orbitInfo').innerHTML = '楕円<br>軌道長半径 ' + Math.round(a*10)/10 + '　離心率 ' + Math.round(ecc*100)/100 + '　周期 ' + Math.round(2*pi*Math.sqrt(a*a*a/GM)*10)/10 + '秒';
    } else if (ecc < 1.01) {
        document.getElementById('orbitInfo').innerHTML = '放物線<br>近点距離 ' + Math.round(a*(1-ecc)*10)/10;
    } else {
        document.getElementById('orbitInfo').innerHTML= '双曲線<br>近点距離 ' + Math.round(a*(1-ecc)*10)/10 + '　離心率 ' + Math.round(ecc*100)/100;
    }
}

function eom(x, y, vx, vy) {
    let x1, y1, vx1, vy1;
    x1 = vx;
    y1 = vy;
    vx1 = -GM * x / Math.pow(x*x + y*y, 1.5);
    vy1 = -GM * y / Math.pow(x*x + y*y, 1.5);
    return [x1 * dt, y1 * dt, vx1 * dt, vy1 * dt];
}

function movePlanet2() {
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

function movePlanet() {
    date = new Date();
    time = (date.getTime() - t0) / 1000;
    if (ecc == 0) {
        M = M0 + time * vy0 / x0 * Math.pow(x0/a, 1.5);
        ang = rot * M + theta0;
        r = a;
    } else if (ecc < 1) {
        M = M0 + time * vy0 / x0 * Math.pow(x0/a, 1.5);
        E = M + ecc * Math.sin(M);
        while (Math.abs(E - ecc * Math.sin(E) - M) > 0.01) {
            E = E - (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
        }
        ang = rot * 2 * Math.atan(Math.sqrt((1+ecc)/(1-ecc)) * Math.tan(E/2)) + theta0;
        r = (1 - ecc*ecc) *a / (1 + ecc * Math.cos(ang-theta0));
    } else if (ecc == 1) {
        var b = Math.atan(2*Math.sqrt(2)*x0*Math.pow(a*(1-ecc)/x0, 1.5)/3/vy0/time);
        if (Math.tan(b/2) >= 0) {
            var g = Math.atan(Math.pow(Math.tan(b/2) , 1/3));
        } else {
            var g = -Math.atan(Math.pow(-Math.tan(b/2) , 1/3));
        }
        ang = rot * 2 * Math.atan(2 / Math.tan(2*g)) + theta0;
        r = a * (1 - ecc) / Math.pow(Math.cos((ang-theta0)/2), 2);
    } else {
        M = M0 + time * vy0 / x0 * Math.pow(-x0/a, 1.5);
        var s = (f(11) - 11 * f(1)) / (f(11) - f(1));
        var snew = s - f(s) / fp(s);
        while (Math.abs(snew - s) > 0.01) {
            s = snew;
            snew = s - f(s) / fp(s);
            if (snew <= 0) {
                snew = 0.001;
            }
        }
        if (M >= 0) {
            s = snew;
        } else {
            s = 1 / snew;
        }
        ang = rot * Math.atan2(Math.sqrt(ecc*ecc-1)*(s-1/s), 2*ecc-s-1/s) + theta0;
        r = -a * 0.5 * Math.sqrt((ecc*ecc-1)*Math.pow(s-1/s, 2) + Math.pow(2*ecc-s-1/s, 2));
    }
    x = r * Math.cos(ang);
    y = r * Math.sin(ang);
    if (Math.abs(x) > canvas.width/2 || Math.abs(y) > canvas.height/2) {
        restart();
    }
    setCanvas(x, y);
    drawOrbit();
    document.getElementById('positionInfo').innerHTML = '太陽からの距離 ' + Math.round(r*10)/10;
    if (autoFrag) {
        window.requestAnimationFrame(movePlanet);
    }
}

function drawOrbit() {
    var dist;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    for (var t=0; t<100; t++) {
        ang = theta0 + rot * 2 * pi * t / 100;
        if (ecc == 0) {
            dist = a;
        } else {
            dist = (1 - ecc*ecc) * a / (1 + ecc * Math.cos(2*pi*t/100));
        }
        if (dist > 0) {
            ctx.beginPath();
            ctx.arc(canvas.width/2+dist*Math.cos(ang), canvas.height/2-dist*Math.sin(ang), 1, 0, 2*pi, false);
            ctx.fill();
        }
    }
}

function f(s) {
    return ecc * (s - 1/s) / 2 - Math.log(s) - Math.abs(M);
}

function fp(s) {
    return ecc * (1 + 1/s/s) / 2 - 1/s;
}

document.body.appendChild(canvas);