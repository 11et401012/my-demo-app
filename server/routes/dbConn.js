exports.objDB = function(){
	var mysql = require('mysql')
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'dbuser',
	  password : 's3kreee7',
	  database : 'my_db'
	});

	connection.connect(function(err) {
		if (err) throw console.log(err);
		console.log("Connected!");
		return connection;
	});
}