var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

function run () {
    canvas.width = 100;
    canvas.height = 100;
    document.body.appendChild(canvas);

    window.setTimeout(() => {
        canvas.style.borderWidth = 0;
    }, 2000);
}

function handleTouchMove(e) {
    for (touch of e.touches) {
        handleTouch(touch);
    }
}

function handleMouseMove(e) {
    handleMove(e.clientX, e.clientY, e.force || 1);
}

var handleTouch = handleMouseMove;

function handleMove(x, y, force) {
    var brushSizePx = 16 * force;
    var halfBrushSizePx = brushSizePx / 2;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        halfBrushSizePx,
        0,
        2 * Math.PI
    );
    ctx.strokeStyle = '1px';
    ctx.stroke();
}

function renderCanvasToBackground() {
    document.body.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    requestAnimationFrame(renderCanvasToBackground);
};

requestAnimationFrame(renderCanvasToBackground);
document.addEventListener('DOMContentLoaded', run);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('touchmove', handleTouchMove);