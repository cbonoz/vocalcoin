const escape = require('pg-escape');

var sql = escape("INSERT INTO issues(user_id, description, title, lat, lng, place, active, time) values('EQo9MtWq9wWd3LmPJaJUX8F25rG2', 'test', 'test title', 41.87515838725938, -87.6318856454468, %L, true, 1514591624548", "Boston Blackie's");
console.log(sql);