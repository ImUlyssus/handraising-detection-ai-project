
import React, { useState } from 'react';
import UploadIcon from '../../public/uploadicon.png';
import axios from 'axios'
import BoundingBoxes from '../components/BoundingBoxes';
import CropBoxes from '../components/CropBoxes';
const UploadVideo = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
      const formData = await loadImageBase64(file);
      const response = await axios({
        method: 'POST',
        url: 'https://detect.roboflow.com/ksh-handraising-modelling/2',
        params: {
          api_key: 'qpO3DIgw1ABqDTMy9rri',
        },
        data: formData,  // Use formData for handling file uploads
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log(response.data.predictions);
      setPredictions(response.data.predictions);
      // Navigate programmatically after a successful response
      // history.push(`/result/${className}`);  // Replace with your desired route

    } catch (error) {
      console.error(error.message);
      // Handle error - display a message to the user or perform other actions.
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Use the className from the route in the header */}
      <header className="text-2xl font-semibold mb-3 items-center">Upload Photo</header>
      <div className="border-b-2 border-gray-300 mb-4 w-full"></div>

      <div className="items-center text-md font-semibold mb-1">
        Get student participation from recording
        <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        {/* Video takes up 50% width */}
        <div style={{ flex: '1', borderRadius: '15px', overflow: 'hidden', height: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="mr-2">
  <div style={{ marginRight: '20px' }}>
    <h2>Uploaded Photo</h2>
    <img
      src={uploadedImage ? uploadedImage : UploadIcon}
      alt="Uploaded"
      style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '5px' }}
    />
  </div>
</div>

        {/* Buttons take up the remaining 50% width */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <input
            id={`uploadedImage`}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <label htmlFor={`uploadedImage`} className="flex-1 border-2 border-teal-500 px-1 py-3 text-black rounded-md mr-3 shadow-md cursor-pointer flex items-center justify-center">
            Upload Image
          </label>
        </div>
      </div>
      {/* show the image with the bounding boxes here */}
      {predictions.length > 0 && (
  <>
    <BoundingBoxes predictions={predictions} base64Image={uploadedImage} />
    <CropBoxes predictions={predictions} base64Image={uploadedImage} />
  </>
)}
    </div>
  );
};

export default UploadVideo;