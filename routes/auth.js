const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.put('/signup', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-mail address already exists.');
                    }
                });
        }),
    body('name').trim().isAlpha().isLength({ min: 5 }).withMessage('please enter a valid name'),
    body('password').trim().isLength({ min: 5 }).withMessage('password must contain atleast 8 characters')
], authController.signup);

router.post('/login', authController.login);

module.exports = router;