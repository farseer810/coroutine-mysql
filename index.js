var mysql = require('mysql');
var Connection = require('./connection');
var Pool = require('./Pool');

function createConnection(options)
{

	return new Promise(resolve, reject){
		var connection = mysql.createConnection(options);
		connection.connect(function(err){
			if(err)
				reject(err);
			resolve(new Connection(connection));
		});
	};
}

function createPool(options)
{
	return new Promise(resolve, reject){
		var pool = mysql.createPool(options);
		try
		{
			resolve(new Pool(pool));
		}
		catch(err)
		{
			reject(err);
		}
	};
}

exports.createConnection = createConnection;
exports.createPool = createPool;