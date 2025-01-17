'use strict';
var express =require('express');
var cors =require('cors');
var mainController = require('./controller/mainController.js');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var mongo = require('mongodb');
var assert = require('assert');
var multiparty = require('multiparty');


app.use('/', express.static(__dirname + '/../assets'));
 
var jsonParser = bodyParser.json()
app.use(cors());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      if(mime.extension(file.mimetype) === "docx") {
          cb(null, 'server/uploads/');
          //  cb(null, './uploads/');
      }
      else{
          cb(null, '')
      }
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, file.originalname);
      //only docx
    });
  }
});

var upload = multer({ storage: storage });
app.post('/login/user',jsonParser, mainController.login);
app.post('/signup/newUser',jsonParser, mainController.signup);
app.post('/tag/add',jsonParser, mainController.category);
app.post('/present/add',jsonParser, mainController.present);
app.post('/delete/tag',jsonParser, mainController.deleteTag);
app.post('/delete/present',jsonParser, mainController.deletePresent);
app.post('/delete/file',jsonParser, mainController.deleteFile);
app.post('/upload/add',jsonParser,upload.single('file'), mainController.uploads);
app.post('/addMeetings/newMeeting',jsonParser, mainController.newMeeting);
app.post('/minutes/index', jsonParser, mainController.fetchMinutes);
app.post('/uploadFetch/index', jsonParser, mainController.fetchUploadFile);
app.post('/present/index', jsonParser, mainController.fetchPresent);

app.post('/tags/index', jsonParser, mainController.fetchCategory);
app.post('/upload', upload.single('file'),mainController.upload);
app.post('/allfiles',mainController.allFiles);
app.post('/show',jsonParser,mainController.showFile);
app.post('/edit',jsonParser,mainController.editFile);
app.post('/get/value', jsonParser, mainController.sendEndVal);
app.post('/minute/edit', jsonParser,mainController.editMinute);
var server = app.listen(process.env.PORT||8080, function () {
   var host = server.address().address
   var port =  process.env.PORT || 8080;
   
   console.log("Example app listening at http://%s:%s", host, port); 
})


