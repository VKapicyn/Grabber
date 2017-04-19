var dataModel = require('../models/dataModel').dataModel;
var fs = require('fs');

exports.mainPage = function(req, res){
    if(req.session.user)
        dataModel.find().limit(50).then(function(data){
            config = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
            res.render('main', {user: req.session.user, data: data, config: config});
        })
    else
        res.redirect('/login');
}

exports.addCompany = function(req, res){
    if(req.session.user){
        let obj = {};
        obj.url = req.body.url;
        obj.data = '';
        obj.hashCode = '';
        obj.update = 0;
        dataModel.findOne({companyName: req.body.name}).then(function(result){
            if (result != null){
                result.urls.push(obj);
                result.save();
            } else {
                var company = new dataModel();
                company.companyName = req.body.name;
                company.urls.push(obj);
                company.save();
            }
        }) 
        res.redirect('/')
    } 
}

exports.delCompany = function(req, res){
    if(req.session.user){
        dataModel.findOne({_id: req.params.company}).then(function(company){
                for (let i=0; i<company.urls.length; i++){            
                    if (company.urls[i]._id == req.params.id){
                        company.urls.splice(i, 1);
                        company.save();
                        break;
                    }
                }
        });
        res.redirect('/');
    }
}

//сделать
exports.setConfig = function(req, res){
    try{
        let data = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
        data.email = (req.body.email == '') ? data.email : req.body.email;
        data.timeframe = (req.body.timeframe == '') ? data.timeframe  : req.body.timeframe*1000;
        data.keyWords = (req.body.keywords == '') ? data.keyWords : req.body.keywords.split(',');
        let dataJson = JSON.stringify(data);
        fs.writeFile('src/dataConfig.json', dataJson);
        res.send('<a href="/"> <--назад</a><br>Сохранил!')
    }
    catch(e){
        console.log(e); res.send('Неверные входне данные');
    }
}

exports.searchCompany = function(req, res){
    if(req.session.user){
        let query = dataModel.find();
        if (req.body.search_company != '')
            query.where({companyName: {$regex: req.body.search_company, $options:'i'}})

        query.limit(50).then(function(data){
            config = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
            res.render('main', {user: req.session.user, data: data, config: config});
        })
    }
    else
        res.redirect('/login');
}