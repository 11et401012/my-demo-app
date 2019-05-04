var mysql = require('mysql');
var dbConnection = function(req, res, next){
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'node_crud'
	});

	connection.connect(function(err) {
		if (err) {
			return res.status(200).send({
				success: false,
				message: 'DB connection error.'
			});
		}
		console.log('connected as id ' + connection.threadId);
		req.objConnection = connection;
		next();
	});
}

module.exports = dbConnection;