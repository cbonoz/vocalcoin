
const library = (function () {
    const axios = require('axios');
    const crypto = require('crypto');

    const PORT = 9007;
    const SECURE_PORT = 443;
    const MAX_EVENTS = 8;

    // const BASE_URL = process.env.REACT_VOCAL_BASE_URL || `http://localhost:${PORT}`;
    const BASE_URL = `https://www.vocalcoin.com:${SECURE_PORT}`;

    // TODO: readd socket.
    // console.log('base url', BASE_URL);
    // const socket = require('socket.io-client')(BASE_URL);

    const getHeaders = () => {
        const token = localStorage.getItem("tok");
        return {
            headers: { Authorization: "Bearer " + token }
        };
    };

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    };

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    };

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

    function postUserQuery(user, address) {
        const url = `${BASE_URL}/api/signin`;
        return axios.post(url, {
            userId: user.uid,
            email: user.email,
            username: user.email.split('@')[0],
            address: address
        }).then(response => {
            const data = response.data;
            return data;
        });
    }


    function getIssuesForUserId(userId) {
        const url = `${BASE_URL}/api/issues/${userId}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    function getVotesForIssueId(issueId) {
        const url = `${BASE_URL}/api/votes/${issueId}`;
        return axios.get(url, getHeaders()).then(response => response.data);
    }

    // TODO: add support for deleting issues (or just mark deleted).
    function postDeleteIssue(userId, issueId) {
        const url = `${BASE_URL}/api/issue/delete`;
        return axios.post(url, {
            userId: userId,
            issueId: issueId
        }, getHeaders()).then(response => {
            const data = response.data;
            return data;
        });
    }

    function getToggleActiveForIssueId(issueId) {
        const url = `${BASE_URL}/api/issue/toggle/${issueId}`;
        return axios.get(url, getHeaders()).then(response => response.data); 
    }

    function postIssue(issue) {
        const url = `${BASE_URL}/api/issue`;
        return axios.post(url, {
            issue: JSON.stringify(issue)
        }, getHeaders()).then(response => {
            const data = response.data;
            // const eventName = `New Issue added: ${issue.title}`;
            // socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
            //     console.log('action ack', data);
            // });
            return data;
        });
    }

    function postVote(vote) {
        const url = `${BASE_URL}/api/vote`;
        return axios.post(url, {
            vote: JSON.stringify(vote)
        }, getHeaders()).then(response => {
            const data = response.data;
            // const eventName = "New Vote added: " + JSON.stringify(vote.title);
            // socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
            //     console.log('action ack', data);
            // });
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
    function getHasVoted(userId, issueId) {
        const url = `${BASE_URL}/api/hasvoted/${userId}/${issueId}`;
        return axios.get(url, getHeaders()).then(response => response.data); 
    }

    function getBalance(userId) {
        const url = `${BASE_URL}/api/balance/${userId}`;
        // console.log('getBalance', url);
        return axios.get(url, getHeaders()).then(response => response.data); 
    }

    function getAddress(userId) {
        const url = `${BASE_URL}/api/address/${userId}`;
        return axios.get(url, getHeaders()).then(response => response.data); 
    }

    function postAddress(userId, address) {
        const url = `${BASE_URL}/api/address/update`;
        return axios.post(url, {
            userId: userId,
            address: address
        }, getHeaders()).then(response => {
            const data = response.data;
            return data;
        });
    }

    return {
        postVote: postVote,
        postIssue: postIssue,
        postAddress: postAddress,
        postUserQuery: postUserQuery,
        getBalance: getBalance,
        getHasVoted: getHasVoted,
        getAddress: getAddress,
        getIssuesForRegion: getIssuesForRegion,
        getIssuesForUserId: getIssuesForUserId,
        getToggleActiveForIssueId: getToggleActiveForIssueId,
        getVotesForIssueId: getVotesForIssueId,
        getSocketEvents: getSocketEvents,
        getRandom: getRandom,
        getAddress: getAddress,
        formatDateTimeMs: formatDateTimeMs,
        ISSUE_COST: 50,
        VOTE_REWARD: 5
    }

})();
module.exports = library;
