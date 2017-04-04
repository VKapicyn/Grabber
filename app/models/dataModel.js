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


var dataSchema = new mongoose.Schema({
    companyName: String,
    
    urls:[{
        url:String,
        data: String,
        hashCode: String,
        update: Number //при инициализации 0 !!!!
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
                downloadPage(data.url).then(function(result, err){
                    if (data.hashCode != undefined && data.hashCode != ''){
                        if (data.hashCode == result.hashCode()){
                            console.log(company.companyName + ' обновлений нет');
                        }
                        else{
                            //здесь проверка по ключевым словам
                            ahtyng(company.companyName, data.url, '')
                            data.updated++;
                            /*if (false){
                                ahtyng(company.companyName, data.url, key)
                            }
                            else{
                                console.log(comany.companyName + ' обновлений нет');
                            }*/
                        }
                    }
                    data.hashCode = result.hashCode();
                    data.data = result;
                    company.save();
                })
            })
        })
    })
}

function ahtyng(name, url, key){
    console.log(name+' обновление с ключевым словом '+key);
    server.send({
        text: name+' обновление с ключевым словом '+key+', url: '+url, 
        from: 'Рейтинг <reestr@da-strateg.ru>',
        to: getConfig().email,
        subject: 'Обновление'
    }, function(err, message) { console.log(err || message); });
}

function downloadPage(url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            json: true
            }, function (error, response, body) {
                console.log(url)
                if (!error && response.statusCode === 200) {
                    let data;
                    try{
                        console.log(url.indexOf('e-disclosure.ru'))
                        //if (url.indexOf('e-disclosure.ru') >= 0){
                        //  console.log(body);
                        //}
                        data = body
                            .replace(/<\/?[^>]+>/g,'')
                            .replace(/ /g, '')
                            .replace(/\n/g, '');
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