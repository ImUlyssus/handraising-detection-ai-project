import React, {useEffect} from 'react';
// import sharp from 'sharp';

// const CropBoxes = ({ predictions, base64Image }) => {
//   const cropImages = async () => {
//     const croppedImages = [];

//     for (let i = 0; i < predictions.length; i++) {
//       const prediction = predictions[i];

//       if (prediction.class === 'Hand') {
//         const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');

//         // Use sharp to perform cropping based on bounding box
//         const croppedBuffer = await sharp(imageBuffer)
//           .extract({
//             left: prediction.x,
//             top: prediction.y,
//             width: prediction.width,
//             height: prediction.height,
//           })
//           .toBuffer();

//         const croppedImageBase64 = `data:image/png;base64,${croppedBuffer.toString('base64')}`;

//         croppedImages.push(
//           <div key={i} className="mb-4">
//             <h2>Cropped Image {i + 1}</h2>
//             <img
//               src={croppedImageBase64}
//               alt={`Cropped Image ${i + 1}`}
//               style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '5px' }}
//             />
//           </div>
//         );
//       }
//     }

//     return croppedImages;
//   };

//   return <div>{cropImages()}</div>;
// };

// export default CropBoxes;

// import React from 'react';

// const CropBoxes = ({ prediction, base64Image }) => {
//   const cropImage = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     // Set canvas dimensions based on the bounding box
//     canvas.width = prediction.bbox.width + 100;
//     canvas.height = prediction.bbox.height;

//     // Create a new Image object
//     const img = new Image();

//     // Set the source of the Image object to the original base64 image
//     img.src = base64Image;

//     // Draw the cropped image onto the canvas, shifting to the top-left
//     ctx.drawImage(
//       img,
//       prediction.x - 40, // Adjust the value as needed
//       prediction.y - 60, // Adjust the value as needed
//       prediction.bbox.width + 50, // Adjust the value as needed
//       prediction.bbox.height, // Adjust the value as needed
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     // Convert the canvas content to base64
//     const croppedImageBase64 = canvas.toDataURL('image/png');

//     return (
//       <div className="mb-4">
//         <img
//           src={croppedImageBase64}
//           alt="Cropped Image"
//           style={{
//             maxWidth: '400px',
//             maxHeight: '400px',
//             border: '1px solid #ddd',
//             borderRadius: '5px',
//           }}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="mt-4">
//       {cropImage()}
//     </div>
//   );
// };

// export default CropBoxes;
const CropBoxes = ({ predictions, base64Image }) => {
  const cropImages = () => {
    return predictions
      .filter(prediction => prediction.class === 'Hand')
      .map((prediction, index) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions based on the bounding box
        canvas.width = prediction.width + 100;
        canvas.height = prediction.height;

        // Create a new Image object
        const img = new Image();

        // Set the source of the Image object to the original base64 image
        img.src = base64Image;

        // Draw the cropped image onto the canvas
        ctx.drawImage(
          img,
          prediction.x - 40,
          prediction.y - 60,
          prediction.width + 50,
          prediction.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Convert the canvas content to base64
        const croppedImageBase64 = canvas.toDataURL('image/png');

        return (
          <div className="mb-4 mr-4" key={index}>
            <img
              src={croppedImageBase64}
              alt={`Cropped Image ${index}`}
              style={{
                width: '200px', // Adjust the width as needed
                height: '200px', // Adjust the height as needed
                objectFit: 'cover',
                border: '1px solid #ddd',
                borderRadius: '5px',
              }}
            />
          </div>
        );
      });
  };

  return (
    <div className="mt-4 flex flex-nowrap overflow-x-auto">
      {cropImages()}
    </div>
  );
};

export default CropBoxes;


