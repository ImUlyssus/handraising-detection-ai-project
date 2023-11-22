import React, { useState } from 'react';
import UploadIcon from '../../public/uploadicon.png';
import axios from 'axios';
import BoundingBoxes from '../components/BoundingBoxes';
import CropBoxes from '../components/CropBoxes';

const UploadVideo = () => {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const loadImageBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadedVideo(URL.createObjectURL(file));

      // Extract frames per second
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.load();

      video.addEventListener('loadedmetadata', async () => {
        const fps = 1; // Set your desired frames per second
        const interval = 3000 / fps;

        for (let time = 0; time < video.duration; time += interval / 1000) {
          video.currentTime = time;
          await new Promise(resolve => setTimeout(resolve, interval));

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const frameDataUrl = canvas.toDataURL('image/png');
          
          // Send each frame to the Roboflow API
          const response = await axios.post(
            'https://detect.roboflow.com/ksh-handraising-modelling/2',
            {
              api_key: 'rf_B2CN73cxDDRvEJQaawTXaoEfN4z2',
              data: frameDataUrl,
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            }
          );
          

          // Process the response and track predictions and time
          const framePredictions = response.data.predictions;
          setPredictions(prevPredictions => [
            ...prevPredictions,
            { time, predictions: framePredictions },
          ]);
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <header className="text-2xl font-semibold mb-3 items-center">Upload Video</header>
      <div className="border-b-2 border-gray-300 mb-4 w-full"></div>
      
      <div className="items-center text-md font-semibold mb-1">
        Get student participation from recording
        <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
      </div>
      
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ flex: '1', borderRadius: '15px', overflow: 'hidden', height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="mr-2">
          <div style={{ marginRight: '20px' }}>
            <h2>Uploaded Video</h2>
            <video
              controls
              style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <source src={uploadedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <input
            id={`uploadedVideo`}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor={`uploadedVideo`} className="flex-1 border-2 border-teal-500 px-1 py-3 text-black rounded-md mr-3 shadow-md cursor-pointer flex items-center justify-center">
            Upload Video
          </label>
        </div>
      </div>

      {predictions.length > 0 && (
        <>
          {/* Display BoundingBoxes for the first frame */}
          <BoundingBoxes predictions={predictions[0].predictions} base64Image={uploadedVideo} />

          {/* Display CropBoxes for each frame with time */}
          <CropBoxes frames={predictions} base64Video={uploadedVideo} />
        </>
      )}
    </div>
  );
};

export default UploadVideo;
