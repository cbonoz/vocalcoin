const library = (function () {
    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    return {
        getRandom: getRandom,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

