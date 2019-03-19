var count = 0;
function addAccessCount() {
    count++;
};

function getAccessCount() {
    return count;
};

function secondsToHHMMSS(seconds){
    function pad(s){
        return (s < 10 ? '0' : '') + s;
    };

    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};

module.exports = {addAccessCount, getAccessCount, secondsToHHMMSS };