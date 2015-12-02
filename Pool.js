var Connection = require('./connection');


function Pool(pool)
{
	this._pool = pool;
}

Pool.prototype.getConnection = function(){
	return new Promise(resolve, reject){
		this._pool.getConnection(function(err, connection){
			if(err)
				reject(err);
			resolve(new Connection(connection));
		});
	};
};

Pool.prototype.end = function(){
	return new Promise(resolve, reject){
		this._pool.end(function(err){
			if(err)
				reject(err);
			resolve(this);
		});
	};
};


module.exports = Pool;