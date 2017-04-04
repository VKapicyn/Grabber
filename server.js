var express = require('express');
var bodyParser = require('body-parser');
var dbModel = require('./app/models/db-model');
var app = express();
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/buffer')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({storage: storage});
var monitoring = require('./app/models/dataModel').monitoring;


app.use(session({
  secret: require('./app/config.js').secret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ 
    url: require('./app/models/db-model').url
  })
}));
app.use(bodyParser());
app.use(express.static('./src/buffer'));                                                                
app.use(bodyParser.json());
app.use(express.static(__dirname + '/src'));                                                                                                    
app.set('views', './app/views');
app.set('view engine', 'jade');


monitoring();
let timeId = setInterval(function(){
  monitoring();
}, require('./app/models/dataModel').getConfig().timeframe);

app.get('/', require('./app/controllers/main').mainPage);

app.listen(require('./app/config.js').port);
console.log('Server started!');                                                                                                                                                              