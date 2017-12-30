const library = (function () {
    const escape = require('pg-escape');

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
            `values('${vote.issueId}', '${vote.userId}', ${vote.lat}, ${vote.lng}, ${vote.time}, ${escape.literal(vote.message)}, ${vote.agree})`;
    }

    function checkVoteQuery(vote) {
        return `SELECT * from votes where issue_id='${vote.issueId}' and user_id='${vote.userId}'`;
    }

    function insertIssueQuery(issue) {
        return `INSERT INTO issues(user_id, description, title, lat, lng, place, active, time) ` +
            `values('${issue.userId}', ${escape.literal(issue.description)}, ${escape.literal(issue.title)}` +
            `, ${issue.lat}, ${issue.lng}, ${escape.literal(issue.place)}, ${issue.active}, ${issue.time})`;
    }

    function toggleActiveForIssueId(issueId) {
        return `UPDATE issues SET active = NOT active WHERE issue_id='${issueId}'`;
    }

    function getUserQuery(userId) {
        return `SELECT * FROM users where ID='${userId}`;
    }

    function insertUserQuery(userId, email, address, username) {
        return `INSERT INTO users(ID, email, address, username) ` +
            `values('${userId}', ${escape.literal(email)}, ${escape.literal(address)}, ${escape.literal(username)})`;
    }

    function getIssuesForUserQuery(userId) {
        return `SELECT * from issues where user_id='${userId}'`;
    }

    function getVotesForIssueIdQuery(issueId) {
        return `SELECT * from votes where issue_id='${issueId}'`;
    }

    // lat1, lng1 is SW corner, lat2,lng2 is NE corner.
    function getIssuesForRegionQuery(lat1, lng1, lat2, lng2) {
        return `SELECT * from issues where lat > ${lat1} and lat < ${lat2} and lng > ${lng1} and lng < ${lng2}`;
    }

    function insertEventQuery(name, time) {
        return `INSERT INTO events(name, time) values(${escape.literal(event.name)}, ${event.time})`;
    }

    return {
        checkVoteQuery: checkVoteQuery,
        getRandom: getRandom,
        getUserQuery: getUserQuery,
        getIssuesForRegionQuery: getIssuesForRegionQuery,
        getIssuesForUserQuery: getIssuesForUserQuery,
        getVotesForIssueIdQuery: getVotesForIssueIdQuery,
        calculateVocalCredit: calculateVocalCredit,
        insertIssueQuery: insertIssueQuery,
        insertEventQuery: insertEventQuery,
        insertUserQuery: insertUserQuery,
        insertVoteQuery: insertVoteQuery,
        toggleActiveForIssueId: toggleActiveForIssueId,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

