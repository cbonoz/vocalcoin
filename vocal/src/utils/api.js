const library = (function () {
    const axios = require('axios');

    const BASE_URL = "https://www.vocalcoin.com"

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    // TODO: return axios promises for the requests below.

    function getTransactionHistory(user) {
        const email = user.email;
        return null;
    }

    function getAddress(user) {
        const email = user.email;
        return null;
    }

    function postAddress(user) {
        const email = user.email;
        return null;
    }

    return {
        getRandom: getRandom,
        getTransactionHistory: getTransactionHistory,
        getAddress: getAddress,
        postAddress: postAddress,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;
