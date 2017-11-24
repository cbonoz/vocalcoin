const library = (function () {

    const REWARD_VALUE = 5;

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }


    // TODO: update this to not simply return a constant (make a dynamic credit amount).
    const calculateVocalCredit = (email) => {
        return REWARD_VALUE;
    }

    return {
        getRandom: getRandom,
        calculateVocalCredit: calculateVocalCredit,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

