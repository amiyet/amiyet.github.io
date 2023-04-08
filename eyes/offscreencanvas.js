let canvas = null;
let ctxWorker = null;

// Waiting to receive the OffScreenCanvas
self.onmessage = (event) => {
    switch(event.data.type) {
        case "data":
            canvas.width = event.data.payload.width;
            canvas.height = event.data.payload.height;
            ctxWorker.clearRect(0,0,256,256);
            ctxWorker.putImageData(event.data.payload,0,0);
            canvas.convertToBlob().then(blob => {
                self.postMessage(new FileReaderSync().readAsDataURL(blob));
            });
            break;
        case "canvas":
            canvas = event.data.payload;
            ctxWorker = canvas.getContext("2d");
            break;
        default:
            console.log('unexpected message type sent to worker');
    }
};

// Fibonacci function to add some delay to the thread
function fibonacci(num) {
  if (num <= 1) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}

// Start the counter for Canvas B
let counter = 0;
function startCounting() {
  setInterval(() => {
    redrawCanvasB();
    counter++;
  }, 100);
}

// Redraw Canvas B text
function redrawCanvasB() {
  ctxWorker.clearRect(0, 0, canvasB.width, canvasB.height);
  ctxWorker.font = "24px Verdana";
  ctxWorker.textAlign = "center";
  ctxWorker.fillText(counter, canvasB.width / 2, canvasB.height / 2);
}