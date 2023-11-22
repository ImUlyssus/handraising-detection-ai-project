// import React, { useRef, useState}  from 'react';
// import { useParams } from 'react-router-dom';
// import StreamModel from './StreamModel';
// import UploadIcon from '../../public/uploadicon.png';
// const StartModel = () => {
//     const [streamModelRunning, setStreamModelRunning] = useState(false);
//     const [webcamRunning, setWebcamRunning] = useState(false);
//     const videoRef = useRef(null);
//     const [selectedRingtone, setSelectedRingtone] = useState(null);
//     const audioRef = useRef(null);
//   const { className } = useParams();
//   const startWebcam = async () => {
//             try {
//                 // Get access to the user's webcam
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
//                 // Attach the stream to the video element
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             } catch (error) {
//                 console.error('Error accessing webcam:', error);
//             }
//         }
//         const handleToggleWebcam = () => {
//             if (webcamRunning) {
//                 // Stop the webcam
//                 const tracks = videoRef.current?.srcObject?.getTracks();
//                 tracks && tracks.forEach(track => track.stop());
//             } else {
//                 // Start the webcam
//                 startWebcam();
//             }
    
//             // Toggle the webcam state
//             setWebcamRunning(!webcamRunning);
//         };

//   const availableRingtones = [
//     { id: 1, name: 'Ringtone 1', filePath: '/ringtones/ringtone1.mp3' },
//     { id: 2, name: 'Ringtone 2', filePath: '/ringtones/ringtone2.mp3' },
//     { id: 3, name: 'Ringtone 3', filePath: '/ringtones/ringtone3.mp3' },
//     { id: 4, name: 'Ringtone 4', filePath: '/ringtones/ringtone4.mp3' },
//     { id: 5, name: 'Ringtone 5', filePath: '/ringtones/ringtone5.mp3' },
//     { id: 6, name: 'Ringtone 6', filePath: '/ringtones/ringtone6.mp3' },
//     { id: 7, name: 'Ringtone 7', filePath: '/ringtones/ringtone7.mp3' },
//     { id: 8, name: 'Ringtone 8', filePath: '/ringtones/ringtone8.mp3' },
//     { id: 9, name: 'Ringtone 9', filePath: '/ringtones/ringtone9.mp3' },
//     { id: 10, name: 'Ringtone 10', filePath: '/ringtones/ringtone10.mp3' },
// ];
// const handleChooseRingtone = (ringtone) => {
//     // Set the selected ringtone when the user chooses one
//     setSelectedRingtone(ringtone);
//     // Implement any other logic you need
// };
// const handleRingtoneChange = (event) => {
//     const selectedRingtoneId = event.target.value;
//     const selectedRingtoneObject = availableRingtones.find(
//         (ringtone) => ringtone.id.toString() === selectedRingtoneId
//     );

//     // Stop the previous audio if it exists
//     if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//     }

//     // Play the selected ringtone
//     if (selectedRingtoneObject) {
//         const audio = new Audio(selectedRingtoneObject.filePath);
//         audio.play();

//         // Save the audio reference to be able to stop it later
//         audioRef.current = audio;
//     }

//     // Update the state to store the selected ringtone
//     setSelectedRingtone(selectedRingtoneObject);
// };
// const handleStopStreamModel = () => {
//     // Access the media stream tracks
//     handleToggleWebcam();
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then((stream) => {
//         const tracks = stream.getTracks();
  
//         // Stop all video tracks
//         tracks.forEach((track) => {
//           if (track.kind === 'video') {
//             track.stop(); // Stop the camera
//           }
//         });
//       })
//       .catch((error) => {
//         console.error('Error stopping camera:', error);
//       });
  
//     // Perform any other necessary actions upon stopping the StreamModel
//     setStreamModelRunning(!streamModelRunning); // Update state to stop the StreamModel
//   };

// return (
//     <div>
//         <header className="text-2xl font-semibold mb-3">{className}</header>
//         <div className="border-b-2 border-gray-300 mb-4 w-full"></div>

//         <div className="items-center text-md font-semibold mb-1">
//             Running model
//             <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
//         </div>

//         <div style={{ display: 'flex', width: '100%' }}>
//             <div style={{ flex: '1', borderRadius: '15px', overflow: 'hidden', height: '40vh' }} className="mr-2">
//             {streamModelRunning ? (
//         <StreamModel />
//       ) : (
//         <img src={UploadIcon} alt="Upload" />
//       )}
//             </div>
//             <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
//                 <div className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/2">
//                     <select onChange={handleRingtoneChange} className="bg-blue-500 text-white px-10 ml-20 py-2 rounded-md w-1/2">
//                         <option value="" disabled>
//                             Select a ringtone
//                         </option>
//                         {availableRingtones.map((ringtone) => (
//                             <option key={ringtone.id} value={ringtone.id}>
//                                 {ringtone.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <button className="bg-red-500 text-white px-4 py-2 rounded-md w-1/2 mt-4" onClick={handleToggleWebcam()}>
//                 {webcamRunning ? 'Stop model' : 'Start model'}
//                 </button>
//             </div>
//         </div>

//         <div className="border-b-2 border-gray-300 my-4 w-full"></div>

//         <div className="items-center text-md font-semibold mb-1">
//             Current queue
//             <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
//         </div>
//     </div>
// );
// };

// export default StartModel;


import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StreamModel from './StreamModel';
import UploadIcon from '../../public/uploadicon.png';
const StartModel = () => {
    const { className } = useParams();
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [selectedRingtone, setSelectedRingtone] = useState(null);
    const audioRef = useRef(null);
    const [webcamRunning, setWebcamRunning] = useState(true);
    const [starting, setStarting] = useState(false);

    
    const startWebcam = async () => {
        try {
            // Get access to the user's webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // Attach the stream to the video element
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    }
    const handleToggleWebcam = () => {
        // setWebcamRunning(!webcamRunning);
        setStarting(!starting)
        if (starting) {
            // Stop the webcam
            const tracks = videoRef.current?.srcObject?.getTracks();
            tracks && tracks.forEach(track => track.stop());
        } else {
            // Start the webcam
            // startWebcam();
            setStarting(!starting)
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const availableRingtones = [
        { id: 1, name: 'Ringtone 1', filePath: '/ringtones/ringtone1.mp3' },
        { id: 2, name: 'Ringtone 2', filePath: '/ringtones/ringtone2.mp3' },
        { id: 3, name: 'Ringtone 3', filePath: '/ringtones/ringtone3.mp3' },
        { id: 4, name: 'Ringtone 4', filePath: '/ringtones/ringtone4.mp3' },
        { id: 5, name: 'Ringtone 5', filePath: '/ringtones/ringtone5.mp3' },
        { id: 6, name: 'Ringtone 6', filePath: '/ringtones/ringtone6.mp3' },
        { id: 7, name: 'Ringtone 7', filePath: '/ringtones/ringtone7.mp3' },
        { id: 8, name: 'Ringtone 8', filePath: '/ringtones/ringtone8.mp3' },
        { id: 9, name: 'Ringtone 9', filePath: '/ringtones/ringtone9.mp3' },
        { id: 10, name: 'Ringtone 10', filePath: '/ringtones/ringtone10.mp3' },
    ];
    const handleChooseRingtone = (ringtone) => {
        // Set the selected ringtone when the user chooses one
        setSelectedRingtone(ringtone);
        // Implement any other logic you need
    };
    const handleRingtoneChange = (event) => {
        const selectedRingtoneId = event.target.value;
        const selectedRingtoneObject = availableRingtones.find(
            (ringtone) => ringtone.id.toString() === selectedRingtoneId
        );
    
        // Stop the previous audio if it exists
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    
        // Play the selected ringtone
        if (selectedRingtoneObject) {
            const audio = new Audio(selectedRingtoneObject.filePath);
            audio.play();
    
            // Save the audio reference to be able to stop it later
            audioRef.current = audio;
        }
    
        // Update the state to store the selected ringtone
        setSelectedRingtone(selectedRingtoneObject);
    };
    
    

    useEffect(() => {
        const startWebcam = async () => {
            try {
                // Get access to the user's webcam
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                // Attach the stream to the video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };

        startWebcam();

        // Cleanup function to stop the webcam when the component unmounts
        return () => {
            const tracks = videoRef.current?.srcObject?.getTracks();
            tracks && tracks.forEach(track => track.stop());
        };
    }, []); // Empty dependency array ensures that this effect runs once on mount

    useEffect(() => {
        const handleBeforeUnload = () => {
            // Stop the video before leaving the page
            const tracks = videoRef.current?.srcObject?.getTracks();
            tracks && tracks.forEach(track => track.stop());
        };

        const unlisten = navigate((location) => {
            // Stop the video when navigating away from the page
            const tracks = videoRef.current?.srcObject?.getTracks();
            tracks && tracks.forEach(track => track.stop());
        });

        // Add event listener for beforeunload
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Remove the event listeners when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            unlisten();
        };
    }, [navigate]);

    const handleStop = () => {
        // Add logic to stop the webcam or any other action

        // Stop the video before leaving the page
        const tracks = videoRef.current?.srcObject?.getTracks();
        tracks && tracks.forEach(track => track.stop());
    };

    return (
        <div>
            {/* Use the className from the route in the header */}
            <header className="text-2xl font-semibold mb-3">{className}</header>
            <div className="border-b-2 border-gray-300 mb-4 w-full"></div>

            <div className="items-center text-md font-semibold mb-1">
                Running model
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>

            {/* Display the webcam video and buttons in a flex container */}
            <div style={{ display: 'flex', width: '100%' }}>
                {/* Video takes up 50% width */}
                <div style={{ flex: '1', borderRadius: '15px', overflow: 'hidden', height: '40vh' }} className="mr-2">
                    {/* <video ref={videoRef} style={{ width: '100%', height: 'auto' }} autoPlay playsInline /> */}
                    {/* {starting ? (
        <StreamModel starting={starting?starting:false} />
      ) : (
        <img src={UploadIcon} alt="Upload" />
      )} */}
                </div>
                {/* Buttons take up the remaining 50% width */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <button className={`border ${starting ? 'border-red-500' : 'border-green-500'} font-semibold bg-white text-${webcamRunning ? 'red-500' : 'green'} px-4 py-4 rounded-md mb-2 w-1/2`} onClick={handleToggleWebcam}>
                        {starting ? 'Stop model' : 'Start model'}
                    </button>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-md w-1/2">
            <select onChange={handleRingtoneChange} className="bg-blue-500 text-white px-10 ml-20 py-2 rounded-md w-1/2">
                <option value="" disabled>
                    Select a ringtone
                </option>
                {availableRingtones.map((ringtone) => (
                    <option key={ringtone.id} value={ringtone.id}>
                        {ringtone.name}
                    </option>
                ))}
            </select>
        </div>
                </div>
            </div>
            <div className="border-b-2 border-gray-300 my-4 w-full"></div>
            <div className="items-center text-md font-semibold mb-1">
                Current queue
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
        </div>
    );
};

export default StartModel;