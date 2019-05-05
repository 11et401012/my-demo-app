var router = express.Router();
const jwt = require('jsonwebtoken');
const key = require('../../keys/public');

var UserLogin = function(req, res, next) {
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
//							var current_date = (new Date()).valueOf().toString();
//							var random = Math.random().toString();
//							var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

							var user_id = rows[0].id;

							var token = jwt.sign({user_id:user_id},key.key);
							console.log(":Asdsad")

							var query = conn.query('delete from login_tokens where user_id = '+user_id+'');
							var query = conn.query('insert into login_tokens (user_id, token) values ('+user_id+', "'+hash+'")');
//							console.log(query.sql);

							return res.status(200).send({
								success: true,
								message: "Login successfully",
								token: token,
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
};

module.exports = UserLogin();