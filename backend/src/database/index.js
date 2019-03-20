const mongoose = require('mongoose');

const databaseName = process.env.NODE_ENV === 'prod' ? 'database' : 'database_test';
var mongoUrl = process.env.MONGO_URL;

mongoUrl += '/' + databaseName;

console.log('database url: ' + mongoUrl);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
}, function(err) {
    if (err)
        process.exit(1);
});

module.exports = mongoose;

