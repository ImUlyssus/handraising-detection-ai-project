import React, { useEffect, useRef } from 'react';

const BoundingBoxes = ({ predictions, base64Image }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const image = new Image();
    image.src = base64Image;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, -15, -6, canvas.width, canvas.height);

      predictions.forEach((prediction) => {
        ctx.beginPath();
        ctx.rect(prediction.x-40, prediction.y-60, prediction.width+7, prediction.height);

        // Set different colors based on the class
        if (prediction.class === 'Hand') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'green';
          ctx.fillStyle = 'transparent';
        } else {
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.fillStyle = 'transparent';
        }

        ctx.stroke();
      });
    };
  }, [base64Image, predictions]);

  return (
    <div>
      <h2>Result Page</h2>
      <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
        {/* Display the image with bounding boxes */}
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          width={640} // Set the width and height according to your image dimensions
          height={640}
        />
      </div>
    </div>
  );
};

export default BoundingBoxes;
