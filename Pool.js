var Connection = require('./connection');

/**
 * Definition of class Pool, which takes a node-mysql pool object 
 * as the only argument of its constructor.
 * 
 * @param {Pool} node-mysql pool object
 * @return none
 * @api public
 */
function Pool(pool) {
    this._pool = pool;
}

/**
 * Get a connection from the pool.
 * 
 * @param none
 * @return {Promise} connection object
 * @api public
 */
Pool.prototype.getConnection = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._pool.getConnection(function(err, connection) {
            if (err)
                return reject(err);
            return resolve(new Connection(connection));
        });
    });
};

/**
 * End the pool.
 * 
 * @param none
 * @return {Promise} this pool object
 * @api public
 */
Pool.prototype.end = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._pool.end(function(err) {
            if (err)
                return reject(err);
            return resolve(ctx);
        });
    });
};


module.exports = Pool;
