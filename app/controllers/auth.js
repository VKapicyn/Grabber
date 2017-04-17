var mongoose = require('mongoose');
var dbModel = require('../models/db-model');
var db = dbModel.db;
var authModel = require('../models/authModel');


exports.loginPage = function(req, res){
    res.render('login', {user: req.session});
}

exports.createUser = function(req, res){
    let user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    user = authModel.createUser(user);
    res.send('Зарегестрирован ' + user.username);
}

exports.login = function(req, res, next) {
	if (req.session.user) return res.redirect('/')
 
	authModel.checkUser(req.body)
		.then(function(user){
			if(user){
				req.session.user = {id: user._id, name: user.username}
				res.redirect('/')
			} 
            else {
				return res.send('Не удалось');     
			}
		})
		.catch(function(error){
			return res.send('Не удалось авторизоваться ' + eror);
		})
 
};

exports.createPage = function(req, res){
    if(req.session.user)
        res.render('create')
    else
        res.send('Авторизуйтесь как администратор')
}

exports.logout = function (req, res){
    console.log(req.session);
	if (req.session.user) {
		delete req.session.user;
		res.redirect('/')
	}
};