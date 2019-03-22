const router = require('express').Router();
const getAccessCount = require('../utils/appHelper').getAccessCount;
const secondsToHHMMSS = require('../utils/appHelper').secondsToHHMMSS;

// Export userRoute
module.exports =  router.get('/status', function (req, res, next) {
    // console.log('log count no router: ' + getAccessCount());
    // console.log('uptime: ' + secondsToHHMMSS(process.uptime()));

    res.send({
        message: 'API status!',
        requests: getAccessCount(),
        uptime: secondsToHHMMSS(process.uptime())
    });
});