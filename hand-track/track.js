const video = document.getElementById('myvideo');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let isVideo = false;
let model = null;

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.5, // confidence threshold for predictions.
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
    const [prediction] = predictions;
    if (prediction) {
      console.log(prediction.bbox);
    }
    model.renderPredictions(predictions, canvas, context, video);
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
