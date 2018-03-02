// TODO: update to use proper JWT storing and validation.
const records = {};

// TODO: remove once neolib fully in place.
const balances = {};
exports.setBalance = function(userId, balance) {
    balances[userId] = balance;
}
exports.getBalance = function(userId) {
    return balances[userId];
}
    
exports.assignToken = function(userId, token) {
    records[token] = userId;
    balances[userId] = 50; // TODO: remove once neolib fully in place.
}

exports.findByToken = function(token, cb) {
    process.nextTick(function() {
        if (records[token] !== undefined) {
            const userId = records[token];
            return cb(null, {id: userId, token: token});
        }
        return cb(null, null);
    });
}