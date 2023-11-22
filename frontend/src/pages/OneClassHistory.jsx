import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utilities/axiosInstance';
import './OneClassHistory.css';

const OneClassHistory = () => {
    const { folderName, className } = useParams(); // Extracting className from URL params
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;
    const [imagesFromFolders, setImagesFromFolders] = useState([]);
    const fetchUserImages = async () => {
        try {
            const requestBody = {
                userEmail: userEmail,
                className: className,
            };

            const response = await axiosInstance.post('/user/getImages', requestBody);

            if (response.status === 200) {
                const { imageDetails } = response.data;
                const folderNames = Object.keys(imageDetails);
                const foldersWithImages = {};

                for (const folderName in imageDetails) {
                    foldersWithImages[folderName] = imageDetails[folderName];
                }

                console.log("Images in folders: ",foldersWithImages[folderName]);
                setImagesFromFolders(foldersWithImages[folderName]);
                // setImagesFromFolders(foldersWithImages);
                setFolders(folderNames);
            } else {
                console.error('Failed to fetch images');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            console.error('Error:', errorMessage);
        }
    };

    useEffect(() => {
        fetchUserImages();
    }, []); // Add className and folderName to dependencies to re-fetch images on change

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <header className="text-2xl font-semibold mb-3">{folderName} Record</header>
            <div className="border-b-2 border-gray-300 mb-4 w-full"></div>
            <div className="items-center text-md font-semibold mb-1">
                Students interaction history
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
            <div className="text-md font-semibold mb-1 mr-auto ml-5">
                From Live Classroom Webcam
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
            {/* Rest of your code remains the same */}
            <div className="image-grid">
                {imagesFromFolders.map((imageName, index) => (
                    <img
                        key={index}
                        src={`../../public/History/${userEmail}/${className}/${folderName}/${imageName}`}
                        alt={`Image ${index + 1}`}
                        // className="grid-item"
                        // width="200" // Set the desired width
                        // minHeight="300" // Set the desired height
                        style={{
                            width: '130px', // Image width
                            height: '150px', // Image height
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default OneClassHistory;


// import React from 'react';
// import { useParams, useLocation } from 'react-router-dom';

// const OneClassHistory = () => {
//     const { folderName } = useParams();
//     const location = useLocation();
//     const { images } = location.state || { images: [] }; // Access images from location state

//     return (
//         <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
//             {/* ... your existing code */}
//             <div>
//                 {images.map((imageName, index) => (
//                     <img
//                         key={index}
//                         src={`../../../History/${folderName}/${imageName}`}
//                         alt={`Image ${index + 1}`}
//                         width="200" // Set the desired width
//                         height="200" // Set the desired height
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default OneClassHistory;
