var Connection = require('./connection');


function Pool(pool)
{
	this._pool = pool;
}

Pool.prototype.getConnection = function(){
	var ctx = this;
	return new Promise(function(resolve, reject){
		ctx._pool.getConnection(function(err, connection){
			if(err)
				return reject(err);
			return resolve(new Connection(connection));
		});
	});
};

Pool.prototype.end = function(){
	var ctx = this;
	return new Promise(function(resolve, reject){
		ctx._pool.end(function(err){
			if(err)
				return reject(err);
			return resolve(ctx);
		});
	});
};


module.exports = Pool;