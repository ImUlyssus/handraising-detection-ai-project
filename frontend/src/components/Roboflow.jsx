import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const PUBLISHABLE_ROBOFLOW_API_KEY = "rf_B2CN73cxDDRvEJQaawTXaoEfN4z2";
const PROJECT_URL = "https://detect.roboflow.com/ksh-handraising-modelling/";
const MODEL_VERSION = 2;

const Roboflow = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [predictions, setPredictions] = useState([]);

  const startInfer = async () => {
    try {
      const model = await roboflow.auth({
        publishable_key: PUBLISHABLE_ROBOFLOW_API_KEY,
      }).load({
        model: "ksh-handraising-modelling",
        version: MODEL_VERSION,
        onMetadata: function (m) {
          console.log("Model loaded");
        },
      });

      setInterval(() => {
        detect(model);
      }, 1000); // Adjust the interval as needed
    } catch (error) {
      console.error("Error loading model:", error);
    }
  };

  useEffect(() => {
    startInfer();
  }, []);

  const detect = async (model) => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const detections = await model.detect(video);

      setPredictions(detections);

      const ctx = canvasRef.current.getContext("2d");
      drawBoxes(detections, ctx);
    }
  };

  const drawBoxes = (detections, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach((row) => {
      // Draw bounding boxes based on predictions
      // Implement your drawing logic here similar to your previous code
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <Webcam
        ref={webcamRef}
        className="absolute mx-auto left-0 right-0 text-center z-10"
      />
      <canvas
        ref={canvasRef}
        className="absolute mx-auto left-0 right-0 text-center z-20"
      />
    </div>
  );
};

export default Roboflow;
