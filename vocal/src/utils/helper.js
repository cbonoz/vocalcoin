const library = (function () {
    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    };

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(parseInt(timeMs));
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    };

    function getAgreeScoreFromVotes(votes) {
        let score = 0;
        votes.map((vote) => {
            score += vote.agree;
        });
        return score;
    }

    function processError(err) {
        if (typeof(err) === 'string') {
            return err;
        } else if (err.hasOwnProperty('message')) {
            return err['message'];
        } else if (err.hasOwnProperty('data')) {
            return JSON.stringify(err['data']);
        } else if (err.hasOwnProperty('response')) {
            let resp = '';
            try {
                resp = JSON.parse(err['response']);
            } catch (e) {
                resp = err;
            }
            if (resp.hasOwnProperty('data')) {
                const data = resp['data'];
                if (data.hasOwnProperty('name')) {
                    return data['name'];
                }
            } else if (resp.hasOwnProperty('name')) {
                return JSON.stringify(resp['name']);
            }
            const respString = JSON.stringify(resp);
            return respString.substr(0, Math.min(50, respString.length));

        }

        return "There was an error connecting to the Vocal server";
        // const errString = JSON.stringify(err);
        // return errString.substr(0, Math.min(50, errString.length))
    }

    function convertAgreeToText(agree) {
        switch (agree) {
            case -1:
                return "Disagree";
            case 1:
                return "Agree";
            default:
                return "No Opinion";
        }
    }

    function capitalize(str) {
        if (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
    }

    return {
        capitalize: capitalize,
        convertAgreeToText: convertAgreeToText,
        getAgreeScoreFromVotes: getAgreeScoreFromVotes,
        getRandom: getRandom,
        processError: processError,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

