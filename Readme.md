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
```
mysql.createPool(options) => Pool;

Pool.getConnection() => Connection;
Pool.end() => Pool;
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
APIs:
```
mysql.createConnection(options) => Connection;

Connection.end() => Connection;
Connection.release() => Connection;
Connection.destroy() => Connection;
Connection.select() => results;
Connection.insert() => inserted id;
Connection.delete() => affected rows;
Connection.update() => changed rows;
Connection.query() => results;
Connection.transaction() => Connection;
Connection.commit() => Connection;
Connection.rollback() => Connection;
```

## Select

## Insert

## Delete

## Update

## Query

## Transaction
