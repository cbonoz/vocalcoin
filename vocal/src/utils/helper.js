const library = (function () {
    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        capitalize: capitalize,
        getRandom: getRandom,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

