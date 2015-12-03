# coroutine-mysql
## Table of contents
- [Installation](#install)
- [Introduction](#introduction)
- [Connection pool](#connection-pool)
- [Connections](#connections)
- [Select](#select)
- [Insert](#insert)
- [Delete](#delete)
- [Update](#update)
- [Query](#query)
- [Transaction](#transaction)

## Installation
```sh
$ npm install coroutine-mysql
```

## Introduction
This module is designed to be used together with "co". The installation for "co" is followed:
```sh
$ npm install co
```

For more information on "co": https://www.npmjs.com/package/co

Here is an example on how to use it:

```js
var mysql = require('coroutine-mysql');
var co = require('co');
co(function*(){
	var connection = yield mysql.createConnection({
		host: 'localhost',
		user: 'me',
		password: 'secret',
		database: 'my_db'
	});
	try
	{
		var results = yield connection.select('show databases');
		console.log(results);
	}
	catch(err)
	{
		console.log(err);
	}
	yield connection.end();
}).then(function(){
	// Some code on success
}).catch(function(err){
	/* Some code on failures
	 * In this case, there are only three statement in the generator function above, 
	 * one of which(i.e. the "select") is inside a try-catch block. Therefore, 
	 * failures catched here can only belong to "createConnection" or "end".
	 */
});
```


## Connection pool
Since the Pool class in this module is a simple wrap on the Pool class in node-mysql, the parameter "options" is compatible.

APIs:
```js
mysql.createPool(options) => Pool; //create a connection pool

Pool.getConnection() => Connection;  //get a connection from the pool
Pool.end() => Pool;  //terminate the pool
```


To create a connection pool and to terminate one:
```js
co(function*(){
	var pool = yield mysql.createPool({
		host: 'localhost',
		user: 'me',
		password: 'secret',
		database: 'my_db',
		connectionLimit : 10
	});
	yield pool.end();
});
```

Here's a full example:
```js
var mysql = require('coroutine-mysql');
var co = require('co');
co(function*(){
	var pool = yield mysql.createPool({
		host: 'localhost',
		user: 'me',
		password: 'secret',
		database: 'my_db',
		connectionLimit : 10
	});

	//To get a connection for the pool
	var connection = yield pool.getConnection();
	try
	{
		var sql = "select * from post where id>:id"
		var results = yield connection.select(sql, {id: 2});
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
```


## Connections
Similar to Pool, parameter "options" is also compatible.

APIs:
```js
mysql.createConnection(options) => Connection;  //create a connection

Connection.end() => Connection;  //end the connection
Connection.release() => Connection;  //release the connection back to the pool
Connection.destroy() => Connection;  //destroy the connection
Connection.select(sqlString, vars) => results;  
Connection.insert(tableName, vars) => inserted id;
Connection.delete(tableName, whereClause, whereVars) => affected rows;
Connection.update(tableName, vars, whereClause, whereVars) => changed rows;
Connection.query(sqlString, vars) => results;
Connection.transaction() => Connection;
Connection.commit() => Connection;
Connection.rollback() => Connection;
```

To create a connection and to terminate one:
```js
co(function*(){
	var conn = yield mysql.createConnection({
		host: 'localhost',
		user: 'me',
		password: 'secret',
		database: 'my_db'
	});

	// some code using the connection

	yield conn.end();
});
```


## Select
Method "select" in Connection.

APIs:
```js
Connection.select(sqlString, vars) => results; 
```

Params: 
* 'sqlString': a String represents the sql statement with variables
* 'vars': OPTIONAL, a Object of variables

```js
co(function*(){
	var connection = yield mysql.createConnection(options);
	var results = yield connection.select('show databases');
	console.log(results);
	var sql = 'select title from post where id>:post_id';
	results = yield connection.select(sql, {post_id: 2});
	console.log(results);
	yield connection.end();
});
```


## Insert
Method "insert" in Connection.

APIs:
```js
Connection.insert(tableName, vars) => inserted id;
```

Params: 
* 'tableName': the name of the table
* 'vars': a Object of variables to be inserted

```js
co(function*(){
	var connection = yield mysql.createConnection(options);
	var results = yield connection.insert('post', {title: 'new title'});
	console.log('inserted id: ' + results);
	yield connection.end();
});
```


## Delete
Method "delete" in Connection.

APIs:
```js
Connection.delete(tableName, whereClause, whereVars) => affected rows;
```

Params: 
* 'tableName': the name of the table
* 'whereClause': OPTIONAL, a String represents the "WHERE" clause
* 'whereVars': OPTIONAL, a Object of variables for whereClause

```js
co(function*(){
	var connection = yield mysql.createConnection(options);
	var results = yield connection.delete('post', 'id=:id_to_be_delete', {id_to_be_delete: 1});
	console.log('deleted rows: ' + results);
	yield connection.end();
});
```


## Update
Method "update" in Connection.

APIs:
```js
Connection.update(tableName, vars, whereClause, whereVars) => changed rows;
```

Params: 
* 'tableName': the name of the table
* 'vars': a Object of variables to be updated
* 'whereClause': OPTIONAL, a String represents the "WHERE" clause
* 'whereVars': OPTIONAL, a Object of variables for whereClause

```js
co(function*(){
	var connection = yield mysql.createConnection(options);
	var results = yield connection.update('post', 'id=:id_to_be_delete', {id_to_be_delete: 1});
	console.log('changed rows: ' + results);
	yield connection.end();
});
```


## Query
Method "query" in Connection.

APIs:
```js
Connection.query(sqlString, vars) => results;
```

Params: 
* 'sqlString': a String represents the sql statement with variables
* 'vars': OPTIONAL, a Object of variables

```js
co(function*(){
	var connection = yield mysql.createConnection(options);
	var sql = "select * from post where id>(select AVG(id) from post)";
	var results = yield connection.query(sql);
	console.log(results);
	yield connection.end();
});
```


## Transaction
Methods for using transaction.

APIs:
```js
Connection.transaction() => Connection;
Connection.commit() => Connection;
Connection.rollback() => Connection;
```

```js
co(function*(){
	var connection = yield mysql.createConnection(options);

	yield connection.transaction();
	try
	{
		var lastId = yield connection.insert('post', {title: 'new title'});
		yield connction.delete('post', 'id<:id', {id: lastId - 1});
		yield connection.commit();
	}
	catch(err)
	{
		yield connection.rollback();
	}
	yield connection.end();
});
```