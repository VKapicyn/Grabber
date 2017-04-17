var mongoose = require('mongoose');
var crypto = require('crypto');
var dbModel = require('../models/db-model');
var db = dbModel.db;
 
exports.createUser = function(userData){
	var user = {
		username: userData.username,
		password: userData.password
	}
	return new userModel(user).save()
}
 
exports.getUser = function(id) {
	return userModel.findOne(id)
}

exports.checkUser = function(userData) {
	return userModel
		.findOne({username: userData.username})
		.then(function(doc){
            if(doc!=null){
                if ( doc.password == userData.password ){
                    console.log("User password is ok");
                    return Promise.resolve(doc)
                } else {
                    return Promise.reject("Error wrong")
                }
            }
            else
                return doc;
		})
}

var userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

var userModel = mongoose.model('user3', userSchema);
module.exports.userModel = userModel;