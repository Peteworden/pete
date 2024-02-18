const pi = Math.PI;

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function setCanvas(x, y) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#002';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 10, 0, 2 * pi, false);
    ctx.fill();
    ctx.fillStyle = '#77F';
    ctx.beginPath();
    ctx.arc(canvas.width/2+x, canvas.height/2-y, 10, 0, 2 * pi, false);
    ctx.fill();
}

let x=100, y=0, vx=0, vy, GM, dt=0.01;
vy = 2*pi*x/5;
GM = x*vy*vy;

let prepre_x=1000000, prepre_y=1000000, pre_x=1000000, pre_y=1000000, autoFrag=1;

canvas.addEventListener("mousedown", onmousedown);
canvas.addEventListener("mouseup", onmouseup);

function onmousedown(e){
    console.log(Math.pow(e.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.pageY-canvas.offsetTop-canvas.height/2+y, 2),
        Math.pow(e.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.pageY-canvas.offsetTop-canvas.height/2+y, 2) < 40*40);
    if (Math.pow(e.pageX-canvas.offsetLeft-canvas.width/2-x, 2) + Math.pow(e.pageY-canvas.offsetTop-canvas.height/2+y, 2) < 40*40) {
        autoFrag = 0;
        canvas.addEventListener("mousemove", onmousemove);
    }
}

function onmousemove(e) {
    pre_x = x;
    pre_y = y;
    x = e.pageX-canvas.offsetLeft-canvas.width/2;
    y = -(e.pageY-canvas.offsetTop-canvas.height/2);
    setCanvas(x, y);
    ctx.restore();
}

function onmouseup(e) {
    x = e.pageX-canvas.offsetLeft-canvas.width/2;
    y = -(e.pageY-canvas.offsetTop-canvas.height/2);
    setCanvas(x, y);
    console.log(pre_x, x, pre_y, y);
    vx = (x - pre_x) * 60;
    vy = (y - pre_y) * 60;
    autoFrag = 1;
    canvas.removeEventListener("mousemove", onmousemove);
    movePlanet();
}

function movePlanet() {
    let ctx = canvas.getContext('2d');
    vx += -GM * x / Math.pow(x*x + y*y, 1.5) * dt;
    vy += -GM * y / Math.pow(x*x + y*y, 1.5) * dt;
    x  += vx * dt;
    y  += vy * dt;
    setCanvas(x, y);
    ctx.restore();
    if (autoFrag) {
        window.requestAnimationFrame(movePlanet);
    }
}

window.requestAnimationFrame(movePlanet);

function restart() {
    x = 100;
    y = 0;
    vx = 0;
    vy = 2*pi*x/5;
    autoFrag = 1;
}

document.body.appendChild(canvas);