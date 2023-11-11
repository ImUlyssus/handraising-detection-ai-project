import express from 'express'
const router = express.Router();
import { User } from '../models/user.js';

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

export default router;