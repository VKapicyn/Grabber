var dataModel = require('../models/dataModel').dataModel;
var fs = require('fs');

exports.mainPage = function(req, res){
    if(req.session.user)
        dataModel.find().then(function(result){
            config = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
            let pages = {};
            let data = result.slice(req.params.page*50, Number(req.params.page)*50+50);
            pages.size = result.length;
            pages.count = Math.ceil(Number(pages.size)/50);
            pages.prev = Number(req.params.page)-1;
            pages.next = Number(req.params.page)+1;
            pages.now = req.params.page; 
            res.render('main', {user: req.session.user, data: data, config: config, pages: pages});
        })
    else
        res.redirect('/login');
}

exports.getCompanies = function(req, res) {
    if(req.session.user){
        dataModel.find().then(function(result){
            let itog = '';
            result.map(company => {
                company.urls.map(url => {
                    itog+=company.companyName+';'+url.url+'<br>';
                })
            })
            res.send(itog);
        })
    }
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
        config = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
        let query = dataModel.find();
        if (req.body.search_company != '')
            query.where({companyName: {$regex: req.body.search_company, $options:'i'}})
        if (req.body.search_results != '')
            dataModel.find().then(function(data){
                let some = [];
                for(var i=0; i<data.length; i++){
                    let obj = {};
                    for(var j=0; j<data[i].urls.length; j++){
                        obj.companyName = data[i].companyName;
                        obj.urls = [];
                        if (data[i].urls[j].update >= Number(req.body.search_results)){
                            obj.urls.push(data[i].urls[j]);
                        }
                    }
                    if (obj.urls!=undefined)
                        if(obj.urls.length > 0)
                        some.push(obj);
                }
                res.render('main', {user: req.session.user, data: some, config: config, pages: null});
            })

        query.then(function(data){
            res.render('main', {user: req.session.user, data: data, config: config});
        })
    }
    else
        res.redirect('/login');
}