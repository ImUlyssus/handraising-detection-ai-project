import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery'; // Import jQuery if needed

const StreamModel = ({ starting, updatePredictions }) => {
  const videoRef = useRef(null);
  let predictions1 = 0;
  let predictions2 = 0;
  let predictions3 = 0;
  let predictions4 = 0;
  let currentBatch = 1;
  const [newPredictions, setNewPredictions] = useState([]);

  const initializeStream = () => {
    const video = $('video')[0];
    if (starting && video) {
      var model;
      var cameraMode = 'environment'; // or 'user'

      const startVideoStreamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: cameraMode,
          },
        })
        .then(function (stream) {
          return new Promise(function (resolve) {
            video.srcObject = stream;
            video.onloadeddata = function () {
              video.play();
              resolve();
            };
          });
        });

      var publishable_key = 'rf_B2CN73cxDDRvEJQaawTXaoEfN4z2';
      var toLoad = {
        model: 'ksh-handraising-modelling',
        version: 2,
      };

      const loadModelPromise = new Promise(function (resolve, reject) {
        roboflow
          .auth({
            publishable_key: publishable_key,
          })
          .load(toLoad)
          .then(function (m) {
            model = m;
            resolve();
          });
      });

      Promise.all([startVideoStreamPromise, loadModelPromise]).then(function () {
        $('#loading').removeClass('loading');
        resizeCanvas();
        detectFrame();
      });

      var canvas, ctx;
      const font = '16px sans-serif';

      function videoDimensions(video) {
        // Ratio of the video's intrinsic dimensions
        var videoRatio = video.videoWidth / video.videoHeight;

        // The width and height of the video element
        var width = video.offsetWidth,
          height = video.offsetHeight;

        // The ratio of the element's width to its height
        var elementRatio = width / height;

        // If the video element is short and wide
        if (elementRatio > videoRatio) {
          width = height * videoRatio;
        } else {
          // It must be tall and thin, or exactly equal to the original ratio
          height = width / videoRatio;
        }

        return {
          width: width,
          height: height,
        };
      }

      $(window).resize(function () {
        resizeCanvas();
      });

      const resizeCanvas = function () {
        $('canvas').remove();

        canvas = $('<canvas/>');

        ctx = canvas[0].getContext('2d');

        var dimensions = videoDimensions(video);

        // Set canvas dimensions to match video dimensions
        canvas[0].width = video.videoWidth;
        canvas[0].height = video.videoHeight;

        // Position the canvas above the video element
        canvas.css({
          position: 'absolute',
          width: dimensions.width + 'px',
          height: dimensions.height + 'px',
          left: 0,
          top: 0,
        });

        // Append the canvas inside the container that holds the video
        $('#loading').append(canvas);
      };


      const renderPredictions = function (predictions) {
        var dimensions = videoDimensions(video);
        var scale = 1;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        predictions.forEach(function (prediction) {
          const x = prediction.bbox.x;
          const y = prediction.bbox.y;
          const width = prediction.bbox.width;
          const height = prediction.bbox.height;

          // Set different colors based on class
          if (prediction.class === 'Hand') {
            ctx.strokeStyle = 'green'; // Change color for 'Hand' class to green
            ctx.fillStyle = 'green'; // Change color for 'Hand' class to green
          } else if (prediction.class === 'No hand') {
            ctx.strokeStyle = 'red'; // Change color for 'No hand' class to red
            ctx.fillStyle = 'red'; // Change color for 'No hand' class to red
          } else {
            // Default color for other classes
            ctx.strokeStyle = 'blue';
            ctx.fillStyle = 'blue';
          }

          ctx.lineWidth = 4;
          ctx.strokeRect(
            (x - width / 2) / scale,
            (y - height / 2) / scale + 155,
            width / scale,
            height / scale
          );

          // Draw the label background
          const textWidth = ctx.measureText(prediction.class).width;
          const textHeight = parseInt(font, 10);
          ctx.fillRect(
            (x - width / 2) / scale,
            (y - height / 2) / scale - textHeight - 4 + 155,
            textWidth + 8,
            textHeight + 4
          );

          // Draw the text on top of the bounding box
          ctx.font = font;
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#000000';
          ctx.fillText(
            prediction.class,
            (x - width / 2) / scale + 4,
            (y - height / 2) / scale - textHeight - 1 + 155
          );
        });
      };
      var prevTime;
      var pastFrameTimes = [];
      // Outside the useEffect hook, declare variables to track predictions and FPS
      let totalPredictions = 0;
      let frameCounter = 0;
      let lastUpdate = 0;
      // Inside the detectFrame function
      const detectFrame = function () {
        if (!model) return requestAnimationFrame(detectFrame);

        model
          .detect(video)
          .then(function (predictions) {
            requestAnimationFrame(detectFrame);
            renderPredictions(predictions);

            // Process each prediction and add the base64 image data
            predictions.forEach((prediction) => {
              const { x, y, width, height } = prediction.bbox;
              const croppedCanvas = document.createElement('canvas');
              croppedCanvas.width = width;
              croppedCanvas.height = height;

              const croppedCtx = croppedCanvas.getContext('2d');
              croppedCtx.drawImage(
                video,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
              );

              const base64Image = croppedCanvas.toDataURL('image/png');
              prediction.base64Image = base64Image; // Add the base64 image data to the prediction object
              prediction.time = Date.now();
            });
             // Execute the code every second
            setNewPredictions(predictions)
          })
          .catch(function (e) {
            console.log('CAUGHT', e);
            requestAnimationFrame(detectFrame);
          });
      };
    }
  };
  // const updatePredictionsBatch = () => {
  //   if (newPredictions.length && currentBatch === 1) {
  //     newPredictions.batch = 1;
  //     updatePredictions(newPredictions);
  //     predictions1 = newPredictions[0].time;
  //     predictions2 = 0;
  //     currentBatch = 2
  //   } else if (newPredictions.length && currentBatch === 2) {
  //     // if(predictions[0].time-predictions1[0].time>500){
  //       newPredictions.batch = 2;
  //     updatePredictions(newPredictions);
  //     predictions2 = newPredictions[0].time;
  //     predictions3 = 0;
  //     currentBatch = 3;
  //     // }
  //   } else if (newPredictions.length && currentBatch === 3) {
  //     if ((newPredictions[0].time - predictions1 >= 1500) && (newPredictions[0].time - predictions1 < 3000)) {
  //       newPredictions.batch = 3;
  //       updatePredictions(newPredictions);
  //       predictions3 = newPredictions[0].time;
  //       predictions4 = 0;
  //       currentBatch = 4
  //     } else {
  //       predictions1 = 0;
  //       predictions4 = 0;
  //       currentBatch = 1
  //     }
  //   } else if (newPredictions.length && currentBatch === 4) {
  //     if ((newPredictions[0].time - predictions2 >= 1500) && (newPredictions[0].time - predictions2 < 3000)) {
  //       newPredictions.batch = 4;
  //       updatePredictions(newPredictions);
  //       predictions4 = newPredictions[0].time;
  //       predictions1 = 0
  //       currentBatch = 1
  //     } else {
  //       predictions2 = 0;
  //       predictions1 = 0;
  //       currentBatch = 1
  //     }
  //   }
  // };
  // setInterval(updatePredictionsBatch, 1000);
  setInterval(newPredictions.length && updatePredictions(newPredictions), 1000);

  useEffect(() => {
    initializeStream();
    // Add dependencies if needed
  }, [starting]);

  return (
    <div id="loading">
      <video id="video" autoPlay muted playsInline></video>
      <div id="fps"></div>
    </div>
  );
};

export default StreamModel;
