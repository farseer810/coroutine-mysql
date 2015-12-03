var mysql = require('..');
var co = require('co');
co(function*(){
    var pool = yield mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'test',
        connectionLimit : 10
    });
    var connection = yield pool.getConnection();
    try
    {
        var sql = "select * from post where id>:id"
        var results = yield connection.select(sql, {id: 20});
        console.log(results);
    }
    catch(err)
    {
        console.log(err);
    }
    yield connection.release();
    yield pool.end();

}).then(function(){
    // Some code on success
}).catch(function(err){
    // Some code on failures
});