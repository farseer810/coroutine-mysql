# coroutine-mysql
## Table of contents
- [Install](#install)
- [Introduction](#introduction)
- [Connection pool](#connection-pool)
- [Establishing connections](#establishing-connections)

## Install
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
	var connection = yield mysql.createConnection({\
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



## Establishing connections