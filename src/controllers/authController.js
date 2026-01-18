const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { username, email, password, phone, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists with this email or username');
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            phone,
            role: role || 'user',
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                },
                message: 'User registered successfully',
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log('Login attempt:', { email, passwordProvided: !!password });
        require('fs').appendFileSync('login_debug.log', JSON.stringify({ timestamp: new Date(), email, passwordProvided: !!password }) + '\n');

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(401);
            throw new Error('Account is deactivated. Please contact support.');
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id, user.role),
            },
            message: 'Login successful',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};
