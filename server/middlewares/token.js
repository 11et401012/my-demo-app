var objLoginTokenModel = require('../routes/model/login_token_model');

var tokenMiddleware = function (req, res, next) {

	//get headers
	var headers = req.headers;

	//get current urls
	var url = req.originalUrl;

	//get mysql connection object
	var conn = req.objConnection;

	//check url is not login
	//if url is not login then check user token
	if(!url.match('login')){

		//get token from headers
		var token = headers.token;

		//if token has not been blank
		if(token){

			//select token related data
			var condition = {
					'token' : token,
			};
			var fields = [
				'user_id',
				'expiry_date',
			];
			objLoginTokenModel.getWhere(fields, condition, conn).then(function(rows){
				if(Array.isArray(rows) && rows.length){
					//get expiry date
					var exipryDate = rows[0].expiry_date;
					if(exipryDate){
						exipryDate = new Date(exipryDate);

						//console.log(exipryDate);
						//console.log(new Date());

						//check expiry date is not expired
						if(exipryDate < new Date()){
							return res.status(200).send({
								success: false,
								message: 'Token has been expired.'
							});
						}
					}else{
						return res.status(200).send({
							success: false,
							message: 'Token related no data found.'
						});
					}

					//get user realted data
					var user_id = rows[0].user_id;
					conn.query('SELECT id, image FROM users where id = "'+user_id+'" limit 1',function(user_err, user_rows, user_fields) {
						if(Array.isArray(user_rows) && user_rows.length){
							req.user_id = user_rows[0].id;
							req.user_image = user_rows[0].image;
							next();
						}else{
							return res.status(200).send({
								success: false,
								message: 'no user found.'
							});
						}
					});
				}else{
					return res.status(200).send({
						success: false,
						message: 'Login token is invalid.'
					});
				}
			})
			.catch(function(err){
				return res.status(200).send({
					success: false,
					message: err.stack
				});
			});
		}else{
			return res.status(200).send({
				success: 'false',
				message: 'Login token is required.'
			});
		}
	}else{
		next()
	}
}

module.exports = tokenMiddleware;