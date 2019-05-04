var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		if(error){
			res.render('user_list', { title: 'User list', rows:{}, error_message: 'No DB connection.' });
		}
		conn.query('SELECT * FROM users ORDER BY id DESC',function(err, rows, fields) {
			res.render('user_list', { title: 'User list', data:rows });
		});
	});

});

/* user login action. */
router.post('/login', function(req, res, next) {
	req.getConnection(function(error, conn) {
		if(error){
			return res.status(200).send({
		      success: 'false',
		      message: 'db connection error'
		    });
		}else{
			var requiredFields = [
				'email',
				'password',
			];

			var data = req.body;

			if(data == undefined){
				return res.status(200).send({
			      success: false,
			      message: "Email, Password fields are required."
			    });
			}else{
				data = JSON.stringify(data);

				var diff = requiredFields.filter(function (i) {
					return data.indexOf(i) === -1;
				});

				if(diff.length){
					return res.status(200).send({
						success: false,
						message: diff.join(', ')+" fields are required.",
					});
				}else{
					var email = req.body.email;
					var password = req.body.password;

					conn.query('SELECT id, email, image FROM users where email = "'+email+'" and password = "'+password+'" limit 1',function(err, rows, fields) {
						if(rows.length == 1){
							var current_date = (new Date()).valueOf().toString();
							var random = Math.random().toString();
							var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

							var user_id = rows[0].id;

							var query = conn.query('delete from login_tokens where user_id = '+user_id+'');
							var query = conn.query('insert into login_tokens (user_id, token) values ('+user_id+', "'+hash+'")');
//							console.log(query.sql);

							return res.status(200).send({
								success: true,
								message: "Login successfully",
								token: hash,
								data: rows[0],
							});
						}else{
							return res.status(200).send({
								success: false,
								message: "Login unsuccessfully"
							});
						}
					});
				}
			}
		}
	});

});

/* GET users listing. */
router.post('/get', function(req, res, next) {
	var user_id = req.user_id;
	var start = req.body.start;
	var limit = 10;

	if(start>0){
		start *= limit;
	}

	req.getConnection(function(error, conn) {
		if(error){
			return res.status(200).send({
		      success: 'false',
		      message: 'db connection error'
		    });
		}else{

			if(start != -1){
				var query = 'SELECT id, email, image FROM users where id != "'+user_id+'" limit '+start+', '+limit;
			}else{
				var query = 'SELECT id, email, image FROM users where id != "'+user_id+'"';
			}

			query = conn.query(query,function(err, rows, fields) {
				if(Array.isArray(rows) && rows.length>0){
					return res.status(200).send({
						success : true,
						message : "data get successfully.",
						data 	: rows,
					});
				}else{
					return res.status(200).send({
						success : true,
						message : "No data found"
					});
				}
			});
			console.log(query.sql);
		}
	});
});

router.post('/edit/:id', function(req, res, next) {
	var id = req.params.id;
	req.getConnection(function(error, conn) {
		if(error){
			return res.status(200).send({
		      success: 'false',
		      message: 'db connection error'
		    });
		}else{
			conn.query('SELECT id, email, image FROM users where id = "'+id+'" limit 1',function(err, rows, fields) {
				if(rows.length == 1){
					return res.status(200).send({
						success : true,
						message : "data get successfully.",
						data 	: rows[0],
					});
				}else{
					return res.status(200).send({
						success : true,
						message : "No data found"
					});
				}
			});
		}
	});
});

router.post('/update/:id', function(req, res, next) {
	var user_id = req.user_id;
	var id = req.params.id;
	var data = req.body;
	req.getConnection(function(error, conn) {
		if(error){
			return res.status(200).send({
				success: 'false',
				message: 'db connection error'
			});
		}else{
			if(user_id == id){
				return res.status(200).send({
					success : true,
					message : "Can not update himself.",
				});
			}
			var pass = data.password;
			conn.query('update users set password = "'+pass+'" where id = '+  id,function(err, rows, fields) {
				if(rows.affectedRows>0){
					return res.status(200).send({
						success : true,
						message : "data updated successfully.",
					});
				}else{
					return res.status(200).send({
						success : true,
						message : "No user found"
					});
				}
			});
		}
	});
});

router.post('/upload_image', function(req, res, next) {
	var user_id = req.user_id;
	var data = req.body;
	console.log(data);
//	req.getConnection(function(error, conn) {
//		if(error){
//			return res.status(200).send({
//				success: 'false',
//				message: 'db connection error'
//			});
//		}else{
//			if(user_id == id){
//				return res.status(200).send({
//					success : true,
//					message : "Can not update himself.",
//				});
//			}
//			var pass = data.password;
//			conn.query('update users set password = "'+pass+'" where id = '+  id,function(err, rows, fields) {
//				if(rows.affectedRows>0){
//					return res.status(200).send({
//						success : true,
//						message : "data updated successfully.",
//					});
//				}else{
//					return res.status(200).send({
//						success : true,
//						message : "No user found"
//					});
//				}
//			});
//		}
//	});
});

module.exports = router;
