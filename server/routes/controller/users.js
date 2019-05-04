var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var crypto = require('crypto');
var Files = require('../../helpers/Files');
var objUserModel = require('../model/user_model');
var objLoginTokenModel = require('../model/login_token_model');
const fs = require('fs')
const sharp = require('sharp')

objUserModel.setTable('users');

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
	var conn = req.objConnection;

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
			objUserModel.getQuery('SELECT id, email, image FROM users where email = "'+email+'" and password = "'+password+'" limit 1', conn).then(function(rows){

				if(rows.length == 1){
					var current_date = (new Date()).valueOf().toString();
					var random = Math.random().toString();
					var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

					var user_id = rows[0].id;

					var objExpiryDate = new Date();
					objExpiryDate.setDate(objExpiryDate.getDate() + 1);

					var expiryDate = objExpiryDate.getFullYear();
					expiryDate += '-'+((objExpiryDate.getMonth())+1);
					expiryDate += '-'+objExpiryDate.getDate();
					expiryDate += ' '+objExpiryDate.getHours();
					expiryDate += ':'+objExpiryDate.getMinutes();
					expiryDate += ':'+objExpiryDate.getSeconds();

					var query = conn.query('delete from login_tokens where user_id = '+user_id+'');
					objLoginTokenModel.create({"user_id":user_id, "token":hash, "expiry_date" : expiryDate},conn).then(function(results){
						return res.status(200).send({
							success: true,
							message: "Login successfully",
							token: hash,
							data: rows[0],
						});
					})
					.catch(function(err){
						return res.status(200).send({
							success: false,
							message: err.stack,
							token: '',
							data: {},
						});
					});
				}else{
					return res.status(200).send({
						success: false,
						message: "Login unsuccessfully"
					});
				}
			})
			.catch(function(err){
				return res.status(200).send({
					success: false,
					message: err.stack,
					token: '',
					data: {},
				});
			});
		}
	}
});

/* GET users listing. */
router.post('/get', function(req, res, next) {
	var user_id = req.user_id;
	var start = req.body.start;
	var limit = 10;

	if(start>0){
		start *= limit;
	}

	var conn = req.objConnection
	var fields = [
		'id',
		'email',
		'image',
	];

	var where = {
		'id !=' : user_id,
	};

	var orderBy = 'id desc';

	objUserModel.getData(fields, where, start, limit, orderBy, conn).then(function(results){
		return res.status(200).send({
			success : true,
			message : "data get successfully.",
			data 	: results,
		});
	})
	.catch(function(err){
		return res.status(200).send({
			success: false,
			message: err.stack,
			data: {},
		});
	});
});

router.post('/update/:id', function(req, res, next) {
	var conn = req.objConnection
	var user_id = req.params.id;
	var pass = req.body.password;
	var fields = {
		'password' : pass,
	};

	var where = {
		'id' : user_id,
	};

	objUserModel.updateData(fields, where, conn).then(function(results){
		return res.status(200).send({
			success : true,
			message : "data updated successfully.",
		});
	})
	.catch(function(err){
		return res.status(200).send({
			success: false,
			message: err.stack,
		});
	});
});

router.post('/upload_image', function(req, res, next) {
	var host = req.headers.host;

	var user_id = req.user_id;

	if (Object.keys(req.files).length == 0) {
		res.status(400).send('No files were uploaded.');
	    return;
	}

	var image = req.files.image;

	var uploadPath = __dirname + '../../../public/uploads/';

	var imageArr = image.name.split('.');
	var randomString = parseInt(Math.random() * 10000000000);
	var imageName = user_id + "_" + randomString + "."  + imageArr[1];
	var thumbImageName = user_id + "_" + randomString + "_thumb."  + imageArr[1];

	var newImagePath = uploadPath + imageName;
	var thumbImagePath = uploadPath + thumbImageName;

	image.mv(newImagePath, function(err) {
		if (err) {
	      return res.status(200).send({
	    	  status  : false,
	    	  message : err
    	  });
	    }

		Files.resize(newImagePath, thumbImagePath, 200, 200);

		var oldImage = req.user_image;
		if(Files.exists(uploadPath + oldImage)){
			Files.remove(uploadPath + oldImage);

			var oldThumbImage = req.user_image;
			oldThumbImage = oldThumbImage.split('.');
			oldThumbImage = oldThumbImage[0]+"_thumb."+oldThumbImage[1];
			if(Files.exists(uploadPath + oldThumbImage)){
				Files.remove(uploadPath + oldThumbImage);
			}
		}

		var connection = req.objConnection;
		objUserModel.getQuery('update users set image = "'+imageName+'" where id = '+user_id, connection).then(function(rows){
			if(rows && rows.affectedRows){
				return res.status(200).send({
					success : true,
					message: 'file uploaded successfully',
					path : host + "/uploads/"+imageName,
					thumb_path : host + "/uploads/"+thumbImageName,
				});
			}else{
				Files.remove(newImagePath);
				return res.status(200).send({
					success : true,
					message : "No user found"
				});
			}
		})
		.catch(function(err){
			return res.status(200).send({
				success: false,
				message: err.stack,
			});
		});
	});
});

module.exports = router;
