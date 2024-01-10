const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, name, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            return User.create({ email, name, password: hashedPassword, status: 'test', posts: [] });
        })
        .then(result => {
            res.status(201).json({ message: 'User Created', userId: result._id });
        })
        .catch(err => {
            next(err);
        });

};

exports.login = (req, res) => {
    const { email, password } = req.body;
    let fetchedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Could not find any user with the entered email');
                err.statusCode = 401;
                throw error;
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(doMatch => {
            if (!doMatch) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id.toString()
            },
                'chipichipichapachapa',
                { expiresIn: '1h' }
            );
            res.status(202).json({ token, userId: fetchedUser._id.toString() });
        })
        .catch(err => {
            next(err);
        });

};