function Connection(connection)
{
	this._connection = connection;
}

Connection.prototype.query = function(){
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



module.exports = Connection;