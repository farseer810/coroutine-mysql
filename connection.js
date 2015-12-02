function Connection(connection)
{
	this._connection = connection;
}

Connection.prototype.select = function(sqlString, values){
	return new Promise(resolve, reject){
		function callback(error, results, fields)
		{
			if(error)
				reject(error);
			resolve(results);
		}
		if(values)
			this._connection.query(sqlString, values, callback);
		else
			this._connection.query(sqlString, callback);
	};
};

Connection.prototype.end = function(err){
	return new Promise(resolve, reject){
		this._connection.end(function(err){
			if(err)
				reject(err);
			resolve(this);
		});
	};
};

Connection.prototype.release = function(){
	this._connection.release();
};


module.exports = Connection;