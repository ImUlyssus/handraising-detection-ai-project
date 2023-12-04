import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../utilities/axiosInstance';
import axios from 'axios'
import { toast } from 'react-toastify';
const Home = () => {
    const [userClasses, setUserClasses] = useState([]);
    const [user, setUser] = useState({ name: '' });
    const [showModal, setShowModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // Retrieve user object from local storage
        const user = JSON.parse(localStorage.getItem('user'));
    
        // Redirect to /login if user object is null
        if (!user) {
            navigate('/login');
            return; // Stop further execution
        }
    
        // Get classes from user object
        const classes = user?.classes || [];
    
        // Filter out empty strings from classes
        const nonEmptyClasses = classes.filter(className => className.trim() !== '');
    
        // Set non-empty classes in the state
        setUserClasses(nonEmptyClasses);
        setUser(user);
    }, [navigate]);
    
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const handleAddClass = async () => {
        if (newClassName.trim() === '') {
            // You can display an error message or prevent adding an empty class
            return toast.error("Cannot create empty class!");
        }
        try {
            // Call the backend API to add the new class
            const response = await axiosInstance.put(`user/${user._id}`, {
                classes: [newClassName],
            });
            console.log(response.data); // Log the response from the backend
            const nonEmptyClasses = response.data.user.classes.filter(className => className.trim() !== '');
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUserClasses(nonEmptyClasses);
            // Close the modal after adding the class
            closeModal();
        } catch (error) {
            console.error(error.message);
            // Handle error - display a message to the user or perform other actions.
        }
    };
    const handleDeleteClass = async (className) => {
        if (window.confirm("This will delete your class history and stuff. Would you like to continue?")) {
            try {
                // Call the backend API to delete the class
                const response = await axiosInstance.delete(`user/${user._id}`, {
                    data: { classes: [className] },
                });
                console.log(response.data); // Log the response from the backend
                const nonEmptyClasses = response.data.user.classes.filter(className => className.trim() !== '');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUserClasses(nonEmptyClasses);
                toast.success("Deleted successfully!")
                // Close the modal after adding the class
                closeModal();
            } catch (error) {
                console.error(error.message);
                // Handle error - display a message to the user or perform other actions.
            }
        } else {
            event.preventDefault(); // Prevent the default behavior of the link
        }
    };

    useEffect(() => {
        // Retrieve user object from local storage
        const user = JSON.parse(localStorage.getItem('user'));

        // Get classes from user object
        const classes = user?.classes || [];

        // Filter out empty strings from classes
        const nonEmptyClasses = classes.filter(className => className.trim() !== '');

        // Set non-empty classes in the state
        setUserClasses(nonEmptyClasses);
        setUser(user);
    }, []);

    const handleLogout = (event) => {
        if (window.confirm("Are you sure you want to logout?")) {
            window.location.href = '/login';
            localStorage.clear();
        } else {
            event.preventDefault(); // Prevent the default behavior of the link
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            {/*  */}
            <header className="text-2xl font-semibold mb-4 flex justify-between w-full items-center">
                <div>{user.name}</div>
                <div className="w-1/4 flex justify-end">
                    <header className="text-2xl font-semibold mr-4">Your Classes</header>
                </div>

                <div>
                    {/* <Link to='/login' onClick={handleLogout}> */}
                    <button className="border-2 border-red-500 bg-white text-lg text-red-500 px-4 py-2 rounded-md mr-2" onClick={handleLogout}>Logout</button>
                    {/* </Link> */}

                    <button className="bg-teal-500 text-lg text-white px-4 py-2 rounded-md" onClick={openModal}>Add Class</button>
                </div>
            </header>
            <div className="border-b-2 border-gray-300 mb-4 w-full"></div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md">
                        <h2 className="text-xl font-semibold mb-4">Add Class</h2>
                        <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="Enter class name"
                            className="w-full px-3 py-2 border rounded-md mb-4"
                        />
                        <div className="flex justify-end">
                            <button className="bg-teal-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleAddClass}>
                                Add Class
                            </button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-screen-lg">
                {userClasses.map((className, index) => (
                    <div key={index} className="bg-white rounded-md p-4 shadow-md mb-4">
                        <div className="text-xl font-semibold mb-4 flex items-center justify-center border-b pb-2">
                            {className}
                        </div>
                        <div className="flex justify-between">

                            <button className="flex-1 bg-teal-500 px-6 py-3 text-white rounded-md mr-3 shadow-md"><Link to={`/startmodel/${className}`}>Start Model</Link></button>
                            <button className="flex-1 border-2 border-teal-500 px-6 py-3 text-black rounded-md shadow-md mr-3">
                                <Link to={`/uploadphoto`}>Upload Photo</Link>
                            </button>
                            <button className="flex-1 border-2 border-teal-500 px-6 py-3 text-black rounded-md shadow-md mr-3">
                                <Link to={`/history/${className}`}>History</Link>
                            </button>
                            <button className="flex-1 border-2 border-red-500 px-6 py-3 text-red-500 rounded-md shadow-md" onClick={() => handleDeleteClass(className)}>
                                Delete
                            </button>

                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
