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
        return `INSERT INTO votes(issue_id, user_id, lat, lng, time, message, agree) ` +
            `values(${vote.issue_id}, ${vote.user_id}, ${vote.lat}, ${vote.lng}, ${vote.time}, ${vote.message}, ${vote.agree})`;
    }

    function insertIssueQuery(issue) {
        return `INSERT INTO issues(user_id, description, title, lat, lng, time) ` +
            `values(${issue.user_id}, ${issue.description}, ${issue.title}, ${issue.lat}, ${issue.lng}, ${issue.time})`;
    }

    function getUserQuery(userId) {
        return `SELECT * FROM users where ID='${userId}`;
    }

    function insertUserQuery(userId, email, address, username) {
        return `INSERT INTO users(ID, email, address, username) ` +
            `values(${userId}, ${email}, ${address}, ${username})`;
    }

    // point 1 is sw corner, point 2 is ne corner.
    function getIssuesQuery(lat1, lng1, lat2, lng2) {
        return `SELECT * from issues where lat > ${lat1} and lat < ${lat2} and lng > ${lng1} and lng < ${lng2}`;
    }

    function insertEventQuery(name, time) {
        return `INSERT INTO events(name, time) values(${event.name}, ${event.time})`;
    }

    return {
        getRandom: getRandom,
        getUserQuery: getUserQuery,
        getIssuesQuery: getIssuesQuery,
        calculateVocalCredit: calculateVocalCredit,
        insertIssueQuery: insertIssueQuery,
        insertEventQuery: insertEventQuery,
        insertUserQuery: insertUserQuery,
        insertVoteQuery: insertVoteQuery,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

