import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, userType, verificationCode, latitude, longitude, locationName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('User already exists with this Email');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            userType,
            verificationCode,
            latitude,
            longitude,
            locationName,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('The Email you entered is not registered!');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('The password you entered is invalid!');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "secretkey", {
            expiresIn: '1h',
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).json({ message: 'User logged in successfully', user });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Logout User
export const logoutUser = async (req, res) => {
    try {
        // Clear the accessToken cookie
        res.clearCookie("accessToken").status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to logout user', error: error.message });
    }
};
