var mysql = require('mysql');
var Connection = require('./connection');
var Pool = require('./pool');


/**
 * Create a connection.
 * 
 * @param {Object} settings for the connection. 
 * @return {Promise} connection
 * @api public
 */
function createConnection(options) {

    return new Promise(function(resolve, reject) {
        var connection = mysql.createConnection(options);
        connection.connect(function(err) {
            if (err)
                return reject(err);
            return resolve(new Connection(connection));
        });
    });
}


/**
 * Create a connection pool.
 * 
 * @param {Object} settings for the connection pool
 * @return {Promise} connection pool
 * @api public
 */
function createPool(options) {
    return new Promise(function(resolve, reject) {
        var pool = mysql.createPool(options);
        try {
            return resolve(new Pool(pool));
        } catch (err) {
            return reject(err);
        }
    });
}

exports.createConnection = createConnection;
exports.createPool = createPool;
