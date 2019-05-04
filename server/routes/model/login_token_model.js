exports.create = function(arr, connection) {
	var keys = [];
	var values = [];
	var markers = [];
	if(arr){
		return new Promise(function(resolve, reject){
			Object.keys(arr).forEach(function(key) {
				keys.push(key);
				markers.push('?');
				values.push(arr[key]);
			});

			keys = keys.join(',');
			markers = markers.join(',');
			connection.query('INSERT INTO login_tokens ('+keys+') VALUES('+markers+')', values, function(err, result) {
				if(err){
					reject(new Error(err));
				}else{
					resolve(result.insertId);
				}
			});
		});
	}
}

exports.getAll = function(connection) {
	return new Promise(function(resolve, reject){
		connection.query('SELECT * FROM login_tokens', function (err, rows) {
			if (err){
				reject(new Error(err));
			}else{
				resolve(rows);
			}
		});
	});
}

exports.getWhere = function(fieldsArr, where, connection) {
	var keyWhere = [];
	var valueWhere = [];
	var fields = '*';
	if(where){
		return new Promise(function(resolve, reject){
			Object.keys(where).forEach(function(key) {
				keyWhere.push(key+" = " + "?");
				valueWhere.push(where[key]);
			});

			keyWhere = keyWhere.join(' and ');

			if(fieldsArr){
				fields = fieldsArr.join(',');
			}

			connection.query('SELECT '+fields+' FROM login_tokens WHERE '+keyWhere, valueWhere, function(err, result) {
				if(err){
					reject(new Error(err));
				}else{
					resolve(result);
				}
			});
		});
	}
}
