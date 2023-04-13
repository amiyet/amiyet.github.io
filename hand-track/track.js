const video = document.getElementById('myvideo');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let isVideo = false;
let model = null;

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 2, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    console.log('video started', status);
    if (status) {
      isVideo = true;
      runDetection();
    }
  });
}

function runDetection() {
  model.detect(video).then((predictions) => {
    const prediction = predictions.find((p) => p.label === 'open');
    if (prediction) {
      console.log(prediction.label);

      context.fillStyle = 'black';
      context.beginPath();
      context.arc(prediction.bbox[0], prediction.bbox[1], 5, 0, 2 * Math.PI);
      context.strokeStyle = '1px';
      context.stroke();
    }
    // model.renderPredictions(predictions, canvas, context, video);
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  startVideo();
  // detect objects in the image.
  model = lmodel;
});
