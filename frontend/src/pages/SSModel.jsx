import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utilities/axiosInstance';
import LiveStream from '../../public/livestream.png'
const StartModel = () => {
    const { className } = useParams();
    const [predictions, setPredictions] = useState([]);
    const [countEven, setCountEven] = useState(0);
    const [countEven2, setCountEven2] = useState(0);
    const [selectedRingtone, setSelectedRingtone] = useState(1);
    const audioRef = useRef(null);
    const [audioOn, setAudioOn] = useState(true);
    const [webcamRunning, setWebcamRunning] = useState(true);
    const [starting, setStarting] = useState(false);
    const [finalPredictions, setFinalPredictions] = useState([]);
    const [newPredictions, setNewPredictions] = useState([]);
    const [queue, setQueue] = useState(1);
    const [oldQueue, setOldQueue] = useState([]);
    const [queue2, setQueue2] = useState([]);
    const [queue3, setQueue3] = useState([]);
    const [queue4, setQueue4] = useState([]);
    const [queue5, setQueue5] = useState([]);
    const [prevQueue, setPrevQueue] = useState(1);
    let user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user.email;
    

    const initializeStream = () => {
        const video = $('video')[0];
        if (video) {
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
                        (y - height / 2) / scale + 100,
                        width / scale,
                        height / scale
                    );

                    // Draw the label background
                    const textWidth = ctx.measureText(prediction.class).width;
                    const textHeight = parseInt(font, 10);
                    ctx.fillRect(
                        (x - width / 2) / scale,
                        (y - height / 2) / scale - textHeight - 4 + 100,
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
                        (y - height / 2) / scale - textHeight - 1 + 100
                    );
                });
            };
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
                            if (prediction.class == "Hand") {
                                const { x, y, width, height } = prediction.bbox;
                                const croppedCanvas = document.createElement('canvas');
                                croppedCanvas.width = width;
                                croppedCanvas.height = height;
                                const enlargedWidth = width + 80;

                                const croppedCtx = croppedCanvas.getContext('2d');
                                croppedCtx.drawImage(
                                    video,
                                    x - 50,
                                    y - 50,
                                    enlargedWidth,
                                    height,
                                    0,
                                    0,
                                    width,
                                    height
                                );

                                const base64Image = croppedCanvas.toDataURL('image/png');
                                prediction.base64Image = base64Image;
                            }
                            // Add the base64 image data to the prediction object
                        });
                        predictions.time = Date.now();
                        setNewPredictions(predictions)
                    })
                    .catch(function (e) {
                        console.log('CAUGHT', e);
                        requestAnimationFrame(detectFrame);
                    });
            };

        }
    };
    useEffect(() => {
        if (newPredictions.length > 0) {
            if (predictions.length == 0) {
                setPredictions([newPredictions]);
            } else if (predictions.length < 30 && newPredictions.time - predictions[predictions.length - 1].time <= 1500) {
                setPredictions((prevPredictions) => [...prevPredictions, newPredictions]);
            } else {
                setQueue(queue + 1);
                setOldQueue((prevPredictions) => [...prevPredictions, finalPredictions])
                saveAndClearRecords();
                setFinalPredictions([]);
                setPredictions([newPredictions]);
            }
        }
    }, [countEven2]);
    useEffect(() => {
        if (predictions.length >= 3) {
            compareHands(predictions[predictions.length - 3], predictions[predictions.length - 1])
            // console.log("Hey, I am here!")
        }
    }, [countEven2])
    useEffect(() => {
        setCountEven(countEven + 1);
    }, [newPredictions])
    useEffect(() => {
        if (countEven % 2 == 0) {
            setCountEven2(countEven2 + 1);
        }
    }, [countEven])
    const compareHands = (array1, array2) => {
        // Filter "Hand" class from each array
        const handsArray1 = array1.filter((prediction) => prediction.class === 'Hand');
        const handsArray2 = array2.filter((prediction) => prediction.class === 'Hand');
        let flag = false;
        // const oldArray = finalPredictions.length;
        // Compare every "Hand" object of handsArray1 with every "Hand" object of handsArray2
        for (let i = 0; i < handsArray1.length; i++) {
            const hand1 = handsArray1[i];
            for (let j = 0; j < handsArray2.length; j++) {
                const hand2 = handsArray2[j];
                const tolerance = 10;
                if (
                    Math.abs(hand1.bbox.x - hand2.bbox.x) <= tolerance &&
                    Math.abs(hand1.bbox.y - hand2.bbox.y) <= tolerance
                ) {
                    const similarInFinalPredictions = finalPredictions.some((prediction) => {
                        return (
                            Math.abs(hand1.bbox.x - prediction.bbox.x) <= tolerance &&
                            Math.abs(hand1.bbox.y - prediction.bbox.y) <= tolerance
                        );
                    });
                    if (!similarInFinalPredictions) {
                        setFinalPredictions((prevPredictions) => [...prevPredictions, hand2]);
                        flag=true;
                    }
                }
            }
        }
        // const newArray = finalPredictions.length;
        if((flag && queue-prevQueue>0 && audioOn) || (queue == 1 && audioOn)){
            setPrevQueue(prevQueue+1)
            const selectedRingtoneObject = availableRingtones.find(
                (ringtone) => ringtone.id === selectedRingtone
            );
            if (selectedRingtoneObject) {
                const audioFilePath = selectedRingtoneObject.filePath;
                // Now you have the file path of the selected ringtone, you can use it to play the audio
                const audio = new Audio(audioFilePath);
                audio.play();
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0; // Reset the audio to the beginning
                }, 3000);
                // Perform other operations if needed
            }
        }
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
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (selectedRingtoneObject) {
            const audio = new Audio(selectedRingtoneObject.filePath);
            audio.play();

            // Save the audio reference to be able to stop it later
            audioRef.current = audio;
        }
        setSelectedRingtone(selectedRingtoneObject);
    };
    const toggleModel = () => {
        setStarting(!starting)
    }
    useEffect(() => {
        initializeStream();
    }, [starting]);
    const saveAndClearRecords = async () => {
        if(finalPredictions.length>0){
            try {
                const requestBody = {
                    finalPredictions: finalPredictions,
                    userEmail: userEmail,
                    className: className
                };
        
                const response = await axiosInstance.post('user/saveAndClear/', requestBody);
        
                if (response.status === 200) {
                    console.log('Records saved and cleared successfully');
                } else {
                    console.error('Failed to save and clear records');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                console.error('Error:', errorMessage);
            }
        }
    };
    const renderImages = () => {
        return (
            finalPredictions.map((prediction, index) => (
                <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                    <div
                        style={{
                            width: '110px', // Box width
                            height: '150px', // Box height
                            padding: '5px',
                            backgroundColor: 'gray',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src={prediction.base64Image}
                            alt={`Cropped Image ${index + 1}`}
                            style={{
                                width: '100px', // Image width
                                height: '110px', // Image height
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                            }}
                        />
                        <div style={{ marginTop: '5px', border: '1px solid #ddd' }}>
                            Order {index}
                        </div>
                    </div>
                </div>
            ))
        )
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
                    {starting ? (
                        <div id="loading">
                            <video id="video" autoPlay muted playsInline></video>
                            <div id="fps"></div>
                        </div>
                    ) : (
                        <div className="text-xl font-semibold flex items-center justify-center border-b pb-2 mt-8" style={{ alignItems: 'center' }}>
                            <img src={LiveStream} />
                        </div>
                    )}
                </div>
                {/* Buttons take up the remaining 50% width */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <button className={`border ${starting ? 'border-red-500' : 'border-green-500'} font-semibold bg-white text-${starting ? 'red-500' : 'green'} px-4 py-4 rounded-md mb-2 w-1/2`} onClick={toggleModel}>
                        {starting ? 'Stop model' : 'Start model'}
                    </button>
                    <button className={`border ${audioOn ? 'border-red-500' : 'border-green-500'} font-semibold bg-white text-${audioOn ? 'red-500' : 'green'} px-4 py-4 rounded-md mb-2 w-1/2`} onClick={()=>setAudioOn(!audioOn)}>
                        {audioOn ? 'Noti Off' : 'Noti On'}
                    </button>
                </div>
            </div>
            <div className="border-b-2 border-gray-300 my-4 w-full"></div>
            <div className="items-center text-md font-semibold mb-1">
                Current queue {queue}
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>

            </div>
            <div className="current-queue" style={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
                {finalPredictions.length > 0 ? (
                    <>
                        {renderImages()}
                    </>
                ) : (
                    <p>No participation yet</p>
                )}
            </div>
        </div>
    )
}

export default StartModel

