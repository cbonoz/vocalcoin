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
    const calculateVocalCredit = (userId) => {
        return REWARD_VALUE;
    }

    function insertVoteQuery(vote) {

    }

    function insertIssueQuery(issue) {

    }

    function addVocalQuery(userId, amount) {

    }

    function updateAddressQuery(userId, newAddress) {

    }

    function insertEventQuery(name, time) {
        return `INSERT INTO events(name, time) values(${event.name}, ${event.time})`;
    }

    return {
        getRandom: getRandom,
        calculateVocalCredit: calculateVocalCredit,
        insertIssueQuery: insertIssueQuery,
        insertEventQuery: insertEventQuery,
        insertVoteQuery: insertVoteQuery,
        addVocalQuery: addVocalQuery,
        updateAddressQuery: updateAddressQuery,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

