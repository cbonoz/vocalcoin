const library = (function () {
    const axios = require('axios');

    const PORT = 9007;
    const MAX_EVENTS = 8;

    const BASE_URL = "https://www.vocalcoin.com"
    // const BASE_URL = `https://www.vocalcoin.com:${PORT}`;
    // const socket = require('socket.io-client')(BASE_URL);
    const socket = null;

    const getHeaders = () => {
        const token = localStorage.getItem("tok");
        const headers = {
            headers: { Authorization: "Bearer " + token }
        };
        console.log('getHeaders', headers);
        return headers;
    }

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    // Get issues within the bounding box of the map.
    function getIssuesForRegion(lat1, lng1, lat2, lng2) {
        const url = `${BASE_URL}/api/issues/region/`;
        return axios.post(url, {
            lat1: lat1,
            lat2: lat2,
            lng1: lng1,
            lng2: lng2
        }, getHeaders()).then(response => {
            const data = response.data;
            return data;
        });
    }

    function postUserQuery(user) {
        const url = `${BASE_URL}/api/signin`;
        return axios.post(url, {
            userId: user.userId,
            username: user.email.split('@')[0]
        }).then(response => {
            const data = response.data;
            return data;
        });
    }

    function getIssueDetails(issueId) {
        const url = `${BASE_URL}/api/issue/${issueId}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    function getIssuesForUser(userId) {
        const url = `${BASE_URL}/api/issues/${userId}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    function getVotesForIssue(issuesId) {
        const url = `${BASE_URL}/api/votes/${issuesId}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    function postVocal(userId) {
        const url = `${BASE_URL}/api/vocal/add`;
        return axios.post(url, {
            userId: userId
        }, getHeaders()).then(response => {
            const data = response.data;
            return data;
        });
    }

    function postIssue(userId, issue) {
        const url = `${BASE_URL}/api/issue`;
        return axios.post(url, {
            userId: userId,
            issue: issue,
        }, getHeaders()).then(response => {
            const data = response.data;
            const eventName = "New Issue added: " + JSON.stringify(data);
            socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
                console.log('action ack', data);
            });
            return data;
        });
    }

    function postVote(userId, vote) {
        const url = `${BASE_URL}/api/vote`;
        return axios.post(url, {
            userId: userId,
            vote: vote
        }, getHeaders()).then(response => {
            const data = response.data;
            const eventName = "New Vote added: " + JSON.stringify(data);
            socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
                console.log('action ack', data);
            });
            return data;
        });
    }

    function getSocketEvents(count) {
        if (!count) {
            count = MAX_EVENTS;
        }
        const url = `${BASE_URL}/api/events/${count}`;
        return axios.get(url).then(response => response.data);
    }

    // TODO: return axios promises for the requests below.

    function getTransactionHistory(user) {
        const userId = user.userId;
        return null;
    }

    function getAddress(user) {
        return null;
    }

    function postAddress(user) {
        return null;
    }

    return {
        postVote: postVote,
        postIssue: postIssue,
        postAddress: postAddress,
        postUserQuery: postUserQuery,
        getIssueDetails: getIssueDetails,
        getIssuesForRegion: getIssuesForRegion,
        getIssuesForUser: getIssuesForUser,
        getVotesForIssue: getVotesForIssue,
        getSocketEvents: getSocketEvents,
        getRandom: getRandom,
        getTransactionHistory: getTransactionHistory,
        getAddress: getAddress,
        formatDateTimeMs: formatDateTimeMs,
        socket: socket
    }

})();
module.exports = library;
