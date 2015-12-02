var mysql = require('../index');
var co = require('co');

co(function*() {
    var conn = yield mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test'
    });
    try {
        var results = yield conn.select('select * from postt where id>:id', {id: 2});
        console.log(results);
    } catch (e) {
    	console.log(e);
    }

    yield conn.end();

}).catch(function(err) {
    console.log('error: ');
    console.log(err);
});