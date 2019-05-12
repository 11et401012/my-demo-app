var Helpers = require('../helpers/Helpers');
var objLoginTokenModel = require('../routes/model/login_token_model');

var tokenMiddleware = function (req, res, next) {

	//get headers
	var headers = req.headers;
	console.log(headers);

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
//			token = Helpers.decrypt(token);
			var user_id = 0;
			var token = Helpers.verifyToken(token);

			token.then(function(payload){
				console.log(payload)
				req.user_id = payload.user_id;
				next();
			}).catch(function(err){
				console.log(err)
				return res.status(200).send({
					success: false,
					message: err.message
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