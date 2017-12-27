const records = { 

}
    
exports.assignToken = function(userId, token) {
    records[token] = userId;
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