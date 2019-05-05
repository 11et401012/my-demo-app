var crypto = require('crypto');
const key = require('../keys/public');
const jwt = require('jsonwebtoken');

class Helpers {
    static createToken(data) {
    	return jwt.sign(data, key.key);
    }

    static verifyToken(token) {
    	return jwt.verify(token, key.key, function (err, payload) {
    		return new Promise(function(resolve, reject){
    			if(err){
    				reject(new Error(err));
    			}else{
    				if(!payload){
    					reject(new Error('Invalid token'));
    				}else{
    					resolve(payload);
    				}
    			}
            });
        });
    }

    static encrypt(str) {
    	var mykey = crypto.createCipher('aes-256-cbc', key.key);
    	var mystr = mykey.update(str, 'utf8', 'hex')
    	mystr += mykey.final('hex');

    	return mystr;
    }

    static decrypt(str) {
    	var mykey = crypto.createDecipher('aes-256-cbc', key.key);
		var mystr = mykey.update(str, 'hex', 'utf8')
		mystr += mykey.final('utf8');

    	return mystr;
    }
}

module.exports = Helpers;