/**
 * Definition of class Connection, which takes a node-mysql connection 
 * object as the only argument of its constructor.It also sets configs
 * before return.
 * 
 * @param {connection}
 * @return none
 * @api public
 */
function Connection(connection) {
    this._connection = connection;
    connection.config.queryFormat = function(query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function(txt, key) {
            if (values.hasOwnProperty(key)) {
                return connection.escape(values[key]);
            }
            return txt;
        }.bind(connection));
    };
}


/**
 * Wrap the "end" method of the connection object.
 * Close the connection.
 * 
 * @param none
 * @return {Promise}
 * @api public
 */
Connection.prototype.end = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._connection.end(function(err) {
            if (err)
                return reject(err);
            return resolve(ctx);
        });
    });
};

/**
 * Wrap the "release" method of the connection object.
 * Realse the connection object back to the connection pool.
 * 
 * @param none
 * @return none
 * @api public
 */
Connection.prototype.release = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        try
        {
            ctx._connection.release();
            return resolve(ctx);
        }
        catch(err)
        {
            return reject(err);
        }
    });
};


/**
 * Wrap the "destroy" method of the connection object.
 * Destroy the connection object.
 * 
 * @param none
 * @return none
 * @api public
 */
Connection.prototype.destroy = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        try
        {
            ctx._connection.destroy();
            return resolve(ctx);
        }
        catch(err)
        {
            return reject(err);
        }
    });
}


/**
 * Perform SELECT and returns the results.
 * 
 * @param {String, Object} sqlString, vars
 * @return {Promise} selected results
 * @api public
 */
Connection.prototype.select = function(sqlString, vars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        var sql;

        function callback(error, results, fields) {
            if (error)
                return reject(error);
            return resolve(results);
        }

        if (vars)
            sql = ctx._connection.query(sqlString, vars, callback);
        else
            sql = ctx._connection.query(sqlString, callback);
    });
};


/**
 * Perform DELETE and returns the number of affected rows.
 * 
 * @param {String, String, Object} tableName, whereClause, whereVars
 * @return {Promise} affected rows
 * @api public
 */
Connection.prototype.delete = function(tableName, whereClause, whereVars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        var sql = "delete from " + tableName + " ";

        function callback(error, result) {
            if (error)
                return reject(error);
            return resolve(result.affectedRows);
        }
        if (whereClause) {
            sql += ' where ' + whereClause;
            sql = ctx._connection.query(sql, whereVars, callback);
        } else
            sql = ctx._connection.query(sql, callback);
    });
};


/**
 * Perform INSERT and returns the last inserted id.
 * 
 * @param {String, Object} tableName, vars
 * @return {Promise} last inserted id
 * @api public
 */
Connection.prototype.insert = function(tableName, vars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        // var sql = 'insert into ' + tableName + ' set ?';
        var sql = "insert into " + tableName + "",
            cols = [],
            values = [];
        for (var key in vars) {
            cols.push(key);
            values.push(ctx._connection.escape(vars[key]));
        }
        sql = sql + '(' + cols.join() + ') values(' + values.join() + ')';
        sql = ctx._connection.query(sql, function(error, result) {
            if (error) {
                return reject(error);
            }
            return resolve(result.insertId);
        });
    });
};


/**
 * Perform UPDATE and returns the number of changed rows.
 * 
 * @param {String, Object, String, Object} tableName, vars, whereClause, whereVars
 * @return {Promise} changed rows
 * @api public
 */
Connection.prototype.update = function(tableName, vars, whereClause, whereVars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        var sql = "update " + tableName + " set ",
            arr = [];
        for (var key in vars)
            arr.push(key + '=' + ctx._connection.escape(vars[key]));
        sql += arr.join();

        function callback(error, result) {
            if (error)
                return reject(error);
            return resolve(result.changedRows);
        }
        if (whereClause) {
            sql += ' where ' + whereClause;
            sql = ctx._connection.query(sql, whereVars, callback);
        } else
            sql = ctx._connection.query(sql, callback);
    });
};


/**
 * Perform QUERY and returns results.
 * 
 * @param {String, Object} sqlString, vars
 * @return {Promise} resulsts
 * @api public
 */
Connection.prototype.query = function(sqlString, vars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        var sql;

        function callback(error, results, fields) {
            if (error)
                return reject(error);
            return resolve(results);
        }

        if (vars)
            sql = ctx._connection.query(sqlString, vars, callback);
        else
            sql = ctx._connection.query(sqlString, callback);
    });
};


/**
 * Wrap the "beginTransaction" method of the connection object.
 * Begin a transaction.
 * 
 * @param none
 * @return {Promise}
 * @api public
 */
Connection.prototype.transaction = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._connection.beginTransaction(function(err) {
            if (err)
                return reject(err);
            return resolve(ctx);
        });
    });
};


/**
 * Perform COOMIT.
 * 
 * @param none
 * @return {Promise}
 * @api public
 */
Connection.prototype.commit = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._connection.commit(function(err) {
            if (err)
                return reject(err);
            return resolve(ctx);
        });
    });
};

/**
 * Perform ROLLBACK.
 * 
 * @param none
 * @return {Promise}
 * @api public
 */
Connection.prototype.rollback = function() {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        ctx._connection.rollback(function(err) {
            if (err)
                return reject(err);
            return resolve(ctx);
        });
    });
};
module.exports = Connection;
