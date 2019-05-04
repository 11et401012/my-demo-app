module.exports = class Base_model {

	setTable(table){
		this.table = table;
	}

	getTable(){
		return this.table;
	}

	create(arr, connection) {
		var keys = [];
		var values = [];
		var markers = [];

		var table = this.getTable();

		if(arr){
			return new Promise(function(resolve, reject){
				Object.keys(arr).forEach(function(key) {
					keys.push(key);
					markers.push('?');
					values.push(arr[key]);
				});

				keys = keys.join(',');
				markers = markers.join(',');
				connection.query('INSERT INTO '+table+' ('+keys+') VALUES('+markers+')', values, function(err, result) {
					if(err){
						reject(new Error(err));
					}else{
						resolve(result.insertId);
					}
				});
			});
		}
	}

	getAll(connection) {
		var table = this.getTable();

		return new Promise(function(resolve, reject){
			connection.query('SELECT * FROM ' + table, function (err, rows) {
				if (err){
					reject(new Error(err));
				}else{
					resolve(rows);
				}
			});
		});
	}

	getData(fieldsArr, where, start = '', limit = '', orderBy = '', connection) {
		var keyWhere = [];
		var valueWhere = [];
		var fields = '*';

		var table = this.getTable();

		if(where){
			return new Promise(function(resolve, reject){

				//set where
				Object.keys(where).forEach(function(key) {
					if(key.match('=')){
						keyWhere.push(key+ " ? ");
					}else{
						keyWhere.push(key+" = " + "?");
					}
					valueWhere.push(where[key]);
				});

				keyWhere = keyWhere.join(' and ');
				//end

				//set select fields
				if(fieldsArr){
					fields = fieldsArr.join(',');
				}
				//end
				//set limit query
				var limitQuery = '';
				if((start != '' || limit != '') && start == -1){
					start = 0;
					limitQuery += ' Limit '+start;
				}
				if(limit!=''){
					if(limitQuery){
						limitQuery += ','+limit;
					}else{
						limitQuery += ' LIMIT '+start+','+limit;
					}
				}
				//end

				//set order by query
				var orderByQuery = '';
				if(orderBy!=''){
					orderByQuery = ' Order by ' + orderBy;
				}
				//end

				var query = 'SELECT '+fields+' FROM '+table+' WHERE '+keyWhere;
				if(orderByQuery){
					query += orderByQuery;
				}

				if(limitQuery){
					query += limitQuery;
				}

				connection.query(query, valueWhere, function(err, result) {
					if(err){
						reject(new Error(err));
					}else{
						resolve(result);
					}
				});
			});
		}
	}

	getQuery(query, connection) {
		if(query){
			return new Promise(function(resolve, reject){
				connection.query(query, function(err, result) {
					if(err){
						reject(new Error(err));
					}else{
						resolve(result);
					}
				});
			});
		}
	}

	updateData(fields, where, connection) {
		var keys = [];
		var values = [];

		var table = this.getTable();

		if(where){
			return new Promise(function(resolve, reject){

				//set where
				Object.keys(where).forEach(function(key) {
					keys.push(key+" = " + "?");
					values.push(where[key]);
				});

				keys = keys.join(' and ');
				//end

				//set select fields
				var fieldsQuery = [];
				if(fields){
					Object.keys(fields).forEach(function(key) {
						fieldsQuery.push(key+" = " + fields[key]);
					});

					fieldsQuery = fieldsQuery.join(' and ');
				}
				//end

				if(fieldsQuery && values){
					var query = 'update '+table+' set '+fieldsQuery+' WHERE '+keys;
					connection.query(query, values, function(err, result) {
						if(err){
							reject(new Error(err));
						}else{
							resolve(result);
						}
					});
				}else{
					reject(new Error('Something went wrong.'));
				}

			});
		}
	}
}