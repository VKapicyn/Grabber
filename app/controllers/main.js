var dataModel = require('../models/dataModel').dataModel;

exports.mainPage = function(req, res){
    res.send('main');
    //рендеринг таблицы
}

exports.addCompany = function(req, res){
    var company = new dataModel();
    //TODO
    company.save();
}

exports.delCompany = function(req, res){

}

exports.searchCompany = function(req, res){
    
}