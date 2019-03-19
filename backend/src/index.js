const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use((req, res, next) => {
    const addAccessCount = require('./app/utils/appHelper').addAccessCount;
    addAccessCount();
    next();
});

app.get('/', (req, res) => res.send('Hello! :)'));

const userRoutes = require('./app/routes/userRoutes');
const statusRoutes = require('./app/routes/statusRouter');

app.use('/api/v1', statusRoutes);
app.use('/api/v1', userRoutes);

app.listen(3000, function(){
    console.log('App is running!');
});

module.exports = app;