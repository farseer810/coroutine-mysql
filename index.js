var mysql = require('mysql');
var Connection = require('./connection');
var Pool = require('./pool');

function createConnection(options)
{

	return new Promise(function(resolve, reject){
		var connection = mysql.createConnection(options);
		connection.connect(function(err){
			if(err)
				return reject(err);
			return resolve(new Connection(connection));
		});
	});
}

function createPool(options)
{
	return new Promise(function(resolve, reject){
		var pool = mysql.createPool(options);
		try
		{
			return resolve(new Pool(pool));
		}
		catch(err)
		{
			return reject(err);
		}
	});
}

exports.createConnection = createConnection;
exports.createPool = createPool;