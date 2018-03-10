const library = (function () {
    const escape = require('pg-escape');

    const VOTE_REWARD = 5;
    const ISSUE_COST = 50;
    const DEFAULT_BALANCE = 100;

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    };

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    };

    // TODO: update this to not simply return a constant (make a dynamic credit amount).
    const calculateVocalCredit = (userId) => {
        return VOTE_REWARD;
    };

    function insertVoteQuery(vote) {
        return `INSERT INTO votes(issue_id, user_id, lat, lng, time, message, agree) ` +
            `values('${vote.issueId}', '${vote.userId}', ${vote.lat}, ${vote.lng}, ${vote.time}, ${escape.literal(vote.message)}, ${vote.agree})`;
    }

    function checkVoteQuery(userId, issueId) {
        return `SELECT * from votes where user_id='${userId}' and issue_id='${issueId}' limit 1`;
    }

    function deleteIssueQuery(userId, issueId) {
        return `DELETE * from issues where user_id='${userId}' and issue_id='${issueId}' limit 1`;
    }

    function insertIssueQuery(issue) {
        return `INSERT INTO issues(user_id, description, title, lat, lng, place, active, time) ` +
            `values('${issue.userId}', ${escape.literal(issue.description)}, ${escape.literal(issue.title)}` +
            `, ${issue.lat}, ${issue.lng}, ${escape.literal(issue.place)}, ${issue.active}, ${issue.time})`;
    }

    function toggleActiveForIssueId(issueId) {
        return `UPDATE issues SET active = NOT active WHERE issue_id='${issueId}'`;
    }

    // Deprecated (maintain by querying sc).
    function modifyBalance(userId, amount) {
        return `UPDATE users SET balance = balance+${amount} where id='${userId}'`;
    }

    // Deprecated (maintain by querying sc).
    function getBalance(userId) {
        return `SELECT balance from users where id='${userId}'`;
    }

    function getUserQuery(userId) {
        return `SELECT * FROM users where ID='${userId}'`;
    }

    function insertUserQuery(userId, email, address, seed, username, pubkey, balance) {
        return `INSERT INTO users(ID, email, address, seed, username, pubkey, balance) ` +
            `values('${userId}', ${escape.literal(email)}, '${address}', '${seed}', ${escape.literal(username)}, '${pubkey}', ${balance})`;
    }

    function getAddress(userId) {
        return `SELECT address from users where ID='${userId}'`;
    }

    function getIssuesForUserQuery(userId) {
        return `SELECT * from issues where user_id='${userId}'`;
    }

    function getVotesForIssueIdQuery(issueId) {
        return `SELECT * from votes where issue_id='${issueId}'`;
    }

    function updateAddressQuery(userId, address) {
        return `UPDATE users SET address=${escape.literal(address)} WHERE userId=${escape.literal(userId)}`;
    }

    // lat1, lng1 is SW corner, lat2,lng2 is NE corner.
    function getIssuesForRegionQuery(lat1, lng1, lat2, lng2) {
        return `SELECT * from issues where lat > ${lat1} and lat < ${lat2} and lng > ${lng1} and lng < ${lng2}`;
    }

    function insertEventQuery(name, time) {
        return `INSERT INTO events(name, time) values(${escape.literal(name)}, ${time})`;
    }

    return {
        checkVoteQuery: checkVoteQuery,
        getAddress: getAddress,
        deleteIssueQuery: deleteIssueQuery,
        isBlank: isBlank,
        getRandom: getRandom,
        getBalance: getBalance,
        modifyBalance: modifyBalance,
        getUserQuery: getUserQuery,
        getIssuesForRegionQuery: getIssuesForRegionQuery,
        getIssuesForUserQuery: getIssuesForUserQuery,
        getVotesForIssueIdQuery: getVotesForIssueIdQuery,
        calculateVocalCredit: calculateVocalCredit,
        insertIssueQuery: insertIssueQuery,
        insertEventQuery: insertEventQuery,
        insertUserQuery: insertUserQuery,
        insertVoteQuery: insertVoteQuery,
        updateAddressQuery: updateAddressQuery,
        toggleActiveForIssueId: toggleActiveForIssueId,
        formatDateTimeMs: formatDateTimeMs,
        ISSUE_COST: ISSUE_COST,
        VOTE_REWARD: VOTE_REWARD,
        DEFAULT_BALANCE: DEFAULT_BALANCE
    }

})();
module.exports = library;

