import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utilities/axiosInstance';

const History = () => {
    const { className } = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;
    const [folders, setFolders] = useState([]);
    const [imagesFromFolders, setImagesFromFolders] = useState([]);
    const navigate = useNavigate();
    // const [imageDetails, setImageDetails] = useState([]);

    const fetchUserImages = async () => {
        try {
            const requestBody = {
                userEmail: userEmail,
                className: className,
            };

            const response = await axiosInstance.post('/user/getImages', requestBody);

            if (response.status === 200) {
                const { imageDetails } = response.data;
                // console.log(response.data)
                // console.log(response.data.imageDetails["2023-11-21-21"].length)
                // console.log(Object.keys(imageDetails))
                // Object.keys(imageDetails).map((folderName, index) => (
                //     // imagesFromFolders.folderName = folderName
                //     setImagesFromFolders(folderName)
                // ))
                const folderNames = Object.keys(imageDetails);
                const foldersWithImages = {};

                for (const folderName in imageDetails) {
                    foldersWithImages[folderName] = imageDetails[folderName];
                }

                // console.log("Images in folders: ",foldersWithImages);
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
    }, []); // Adding an empty dependency array makes sure this runs only once on mount

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <header className="text-2xl font-semibold mb-3">{className} History</header>
            <div className="border-b-2 border-gray-300 mb-4 w-full"></div>
            <div className="items-center text-md font-semibold mb-1">
                Students interaction history
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
            <div className="text-md font-semibold mb-1 mr-auto ml-5">
                From Live Classroom Webcam
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
            {folders.length ?
            <div className="text-md font-semibold mb-1 mr-auto ml-5">
                {/* Display folders */}
                {/* {folders.map((folderName, index) => (
                    <div key={index}>
                        <button className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md">
                    <Link to={`/oneclasshistory/${folderName}`}>{folderName}</Link>
                </button>
                    </div>
                ))} */}
                
                <div className="min-h-screen bg-gray-100 p-8">
                    <div className="grid grid-cols-4 gap-4">
                        
                            {folders.map((folderName, index) => (
                                <div key={index}>
                                    <button className="flex-1 border-2 border-teal-500 px-6 py-3 text-black rounded-md shadow-md mr-3 mb-3">
                                        <Link to={`/oneclasshistory/${className}/${folderName}`}>{folderName}</Link>
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
                </div>
                :
                <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
                <div className="items-center text-md font-semibold mt-20 text-red-500">
                    This class has no history
                </div>
                </div>
            }
                {/* <div>Images</div>
                {Object.keys(imagesFromFolders).map((folderName, index) => (
    <div key={index}>
        <button
            className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md"
            onClick={() => navigate(`/oneclasshistory/${folderName}`, { state: { images: imagesFromFolders } })
        }
        >
            {folderName}
        </button>
    </div>
))} */}
                {/* ... Other parts of your UI */}
            
        </div>
    );
};

export default History;
