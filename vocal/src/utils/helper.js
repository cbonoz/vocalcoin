const library = (function () {
    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    function getAgreeScoreFromVotes(votes) {
        let score = 0;
        votes.map((vote) => {
            score += vote.agree;
        })
        return score;
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

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        capitalize: capitalize,
        convertAgreeToText: convertAgreeToText,
        getAgreeScoreFromVotes: getAgreeScoreFromVotes,
        getRandom: getRandom,
        formatDateTimeMs: formatDateTimeMs
    }

})();
module.exports = library;

