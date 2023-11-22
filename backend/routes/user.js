import express from 'express'
const router = express.Router();
import { User } from '../models/user.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

router.post('/', async (request, response) => {
    try {
        if (!request.body.name || !request.body.email || !request.body.password) {
            return response.status(400).send({
                message: 'Send all required fields: name, email, password',
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email: request.body.email });
        if (existingUser) {
            return response.status(409).send({ message: 'Email is already taken' });
        }

        // Create a new user
        const newUser = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            classes: request.body.classes ? request.body.classes : '',
        };

        const user = await User.create(newUser);

        return response.status(201).send(user);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



// Function to save base64 image data to a file
const saveBase64ImageToFile = (base64Data, filePath) => {
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');

    fs.writeFileSync(filePath, buffer, 'base64');
};


//login route
router.post('/login', async (request, response) => {
    try {
        // Check if both email and password are provided in the request body
        if (!request.body.email || !request.body.password) {
            return response.status(400).send({
                message: 'Send both email and password for login',
            });
        }

        // Check if the email and password match a user in the database
        const user = await User.findOne({
            email: request.body.email,
            password: request.body.password,
        });

        if (user) {
            return response.status(200).json({ message: 'Login successful', user });
        } else {
            return response.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.get('/', async (request, response) => {
    try {
        const users = await User.find({});

        return response.status(200).json({
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.get('/:email', async (request, response) => {
    try {
        const { email } = request.params;

        // Use Mongoose to find a user by email
        const user = await User.findOne({ email });

        if (user) {
            return response.status(200).json(user);
        } else {
            return response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        // Check if at least one field is provided for the update
        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                message: 'At least one field is required for the update',
            });
        }

        // Use Mongoose to update the user with array operations
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $addToSet: { classes: { $each: request.body.classes } } },
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).json({ message: 'User not found' });
        }

        return response.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        // Check if at least one field is provided for the update
        if (Object.keys(request.body).length === 0 || !request.body.classes || !Array.isArray(request.body.classes)) {
            return response.status(400).json({
                message: 'Invalid request body. Provide an array of classes to delete.',
            });
        }

        // Use Mongoose to update the user by pulling specified classes from the array
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $pull: { classes: { $in: request.body.classes } } },
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).json({ message: 'User not found' });
        }

        return response.status(200).json({ message: 'Classes deleted successfully', user: updatedUser });
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/saveAndClear', async (request, response) => {
    try {
        const { finalPredictions, userEmail, className } = request.body;
        const historyFolderPath = '../frontend/public/History/';
        const userEmailFolderPath = path.join(historyFolderPath, userEmail);
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const dateTimeFolder = `${year}-${month}-${day}-${hour}`;
        
        // New code to check for className folder
        const classNameFolderPath = path.join(userEmailFolderPath, className);
        if (!fs.existsSync(classNameFolderPath)) {
            fs.mkdirSync(classNameFolderPath, { recursive: true });
        }

        const dateTimeFolderPath = path.join(classNameFolderPath, dateTimeFolder);
        if (!fs.existsSync(dateTimeFolderPath)) {
            fs.mkdirSync(dateTimeFolderPath);

            finalPredictions.forEach((prediction, index) => {
                const base64Image = prediction.base64Image;
                const imageName = `image_${index + 1}.png`;
                const imagePath = path.join(dateTimeFolderPath, imageName);
                saveBase64ImageToFile(base64Image, imagePath);
            });
        } else {
            finalPredictions.forEach((prediction, index) => {
                const base64Image = prediction.base64Image;
                const imageName = `image_${index + 1}.png`;
                const imagePath = path.join(dateTimeFolderPath, imageName);
                saveBase64ImageToFile(base64Image, imagePath);
            });
        }

        return response.status(200).send('Records saved and cleared successfully');
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).send({ message: 'Failed to save and clear records' });
    }
});


router.post('/getImages', async (request, response) => {
    try {
        const { userEmail, className } = request.body;
        const historyFolderPath = '../frontend/public/History/';
        const userEmailFolderPath = path.join(historyFolderPath, userEmail);
        const classNameFolderPath = path.join(userEmailFolderPath, className);

        if (!fs.existsSync(classNameFolderPath)) {
            return response.status(404).send({ message: 'User folder not found' });
        }

        // Fetch all folders inside the user's email folder
        const userFolders = fs.readdirSync(classNameFolderPath);
        const imageDetails = {};

        for (const folder of userFolders) {
            const folderPath = path.join(classNameFolderPath, folder);
            if (fs.lstatSync(folderPath).isDirectory()) {
                const images = fs.readdirSync(folderPath);
                imageDetails[folder] = images;
            }
        }

        return response.status(200).json({ imageDetails });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).send({ message: 'Failed to fetch images' });
    }
});
router.post('/getImages2', async (request, response) => {
    try {
        const { userEmail, className, folderName } = request.body;
        const userFolderPath = path.join('./frontend/public/History/', userEmail, className, folderName);
        console.log(userFolderPath);
        // console.log(../, __dirname); 
        if (!fs.existsSync(userFolderPath)) {
            return response.status(404).send({ message: 'User folder not found' });
        }

        const images = fs.readdirSync(userFolderPath);

        return response.status(200).json({ images });
    } catch (error) {
        console.error('Error:', error.message);
        response.status(500).send({ message: 'Failed to fetch images' });
    }
});


export default router;