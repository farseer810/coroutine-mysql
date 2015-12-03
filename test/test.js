var mysql = require('..');
var co = require('co');
co(function*(){
    var connection = yield mysql.createConnection({
        host: 'localhost',
        user: 'me',
        password: 'secret',
        database: 'my_db'
    });
    
    console.log('transaction');
    yield connection.transaction();
    try
    {
        console.log('insert');
        var lastId = yield connection.insert('post', {title: 'new title'});
        console.log('delete');
        yield connection.delete('post', 'id<:id', {id: lastId - 2});
        yield connection.commit();
    }
    catch(err)
    {
        console.log(err);
        yield connection.rollback();
    }
    yield connection.end();
});