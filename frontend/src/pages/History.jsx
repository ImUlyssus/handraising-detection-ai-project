import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'

const History = () => {
    // Access the className parameter from the route
    const { className } = useParams();

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            {/* Use the className from the route in the header */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md">
                    <Link to='/startmodel'>Start Model</Link>
                </button>
                <button className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md">
                    <Link to='/startmodel'>Start Model</Link>
                </button>
                <button className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md">
                    <Link to='/startmodel'>Start Model</Link>
                </button>
                <button className="col-span-1 border-2 border-gray-300 px-40 py-5 text-black rounded-md shadow-md">
                    <Link to='/startmodel'>Start Model</Link>
                </button>
            </div>
            <div className="border-b-2 border-gray-300 my-4 w-full"></div>
            <div className="text-md font-semibold mb-1 mr-auto ml-5">
                From Recording
                <div className="border-b-2 border-gray-400 mb-4 w-full"></div>
            </div>
        </div>
    );
};

export default History;
