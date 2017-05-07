var pass = require('../config.js').emailPass;
var fs = require('fs');
var server 	= require('emailjs/email').server.connect({
   user:    'reestr@da-strateg.ru', 
   password: pass, 
   host:    'smtp.beget.com',
   ssl:     true
});
var mongoose = require('mongoose');
var request = require('request');
let cheerio = require('cheerio');
var needle = require('needle');
var iconv  = require('iconv-lite');


var dataSchema = new mongoose.Schema({
    companyName: String,
    //update: Number, //при инициализации 0
    urls:[{
        url:String,
        data: String,
        hashCode: String,
        update: Number
    }]
});

var dataModel = mongoose.model('data_urls', dataSchema);
module.exports.dataModel = dataModel;

function getConfig(){
    let config = JSON.parse(fs.readFileSync('src/dataConfig.json', 'utf8'));
    return config;
}
module.exports.getConfig = getConfig;

exports.monitoring = function(){
    dataModel.find().then(function(result){
        result.map(company => {
            company.urls.map(data =>{
                downloadPage(data.url).then(function(new_result, err){
                    if (data.hashCode != undefined && data.hashCode != ''){

                        if (data.hashCode == new_result.hashCode()){
                            console.log(company.companyName + ', '+ data.url+' обновлений нет');
                        }
                        else{
                            //здесь проверка по ключевым словам
                            let keys = getConfig().keyWords;
                            for (let i=0; i<keys.length; i++) {
                                let last_count = 0;
                                let new_count = 0;
                                var foundPos = 0;
                                while (true) {
                                    foundPos = data.data.indexOf(keys[i], foundPos);
                                    if (foundPos == -1) 
                                        break;
                                    else
                                        last_count++;
                                    foundPos = foundPos + 1;
                                }
                                foundPos = 0;
                                while (true) {
                                    foundPos = new_result.indexOf(keys[i], foundPos);
                                    if (foundPos == -1) 
                                        break;
                                    else
                                        new_count++;
                                    foundPos = foundPos + 1;
                                }
                                //если число ключевых слов изменилось, то оповещаем об этом
                                if(last_count < new_count){
                                    if(data.update != 0)
                                        ahtyng(company.companyName, data.url, keys[i])
                                    data.update++;
                                    break;
                                } 
                            }  
                        }
                    }
                    data.hashCode = new_result.hashCode();
                    data.data = new_result;
                    company.save();
                })
            })
        })
    })
}

function ahtyng(name, url, key){
    server.send({
        text: name+' обновление с ключевым словом "'+key+'", url: '+url, 
        from: 'Рейтинг <reestr@da-strateg.ru>',
        to: getConfig().email,
        subject: 'Обновление '+name
    }, function(err, message) { 
        //console.log(err || message); 
    });
}

function downloadPage(url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    let data;
                    try{
                        if (url.indexOf('e-disclosure.ru') >= 0){
                            let $ = cheerio.load(body);
                            body = $('#content2').html();
                        }
                        data = body
                        resolve(data);
                    }
                    catch(e){
                        resolve(undefined);
                    }
                }
            }
        );
    });
}

String.prototype.hashCode = function() {
    var hash = 0;
 
    try {
    
        if (this.length == 0) return hash;
 
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
        
    } catch (e) {
        throw new Error('hashCode: ' + e);
    }
};