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

Connection.prototype.release = function() {
    this._connection.release();
};

Connection.prototype.destroy = function() {
    this._connection.destroy();
}

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
            sql += whereClause;
            sql = ctx._connection.query(sql, whereVars, callback);
        } else
            sql = ctx._connection.query(sql, callback);
    });
};

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

Connection.prototype.update = function(tableName, vars, whereClause, whereVars) {
    var ctx = this;
    return new Promise(function(resolve, reject) {
        var sql = "update " + tableName + " set ",
            arr = [];
        for (var key in vars)
            arr.push(key + '=' + ctx._connection.escape(vars[key]));
        sql += arr.join() + ' ';

        function callback(error, result) {
            if (error)
                return reject(error);
            return resolve(result.changedRows);
        }
        if (whereClause) {
            sql += whereClause;
            sql = ctx._connection.query(sql, whereVars, callback);
        } else
            sql = ctx._connection.query(sql, callback);
    });
};

Connection.prototype.query = function(sqlString, vars) {};

module.exports = Connection;
