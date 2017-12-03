const library = (function () {
    const axios = require('axios');

    const apiKey = process.env.REACT_APP_VOCAL_MAP_KEY;

    return {
        apiKey: apiKey
    }

})();
module.exports = library;
