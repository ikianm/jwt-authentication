const express = require('express');
const { connect } = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Controll-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data || '';
    res.status(status).json({ message, data });
});

connect(uri)
    .then(() => {
        console.log('server is listening on port 8080');
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });

