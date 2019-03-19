const mongoose = require('mongoose');

const databaseName = process.env.NODE_ENV === 'prod' ? 'databse' : 'database_test';
var mongoUrl = process.env.MONGO_URL;

mongoUrl += '/' + databaseName;

console.log('database url: ' + mongoUrl);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports = mongoose;

