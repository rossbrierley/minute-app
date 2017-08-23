const async = require('async'),
    request = require('request'),
    fs = require('fs');
const mammoth = require("mammoth");
var officeClippy = require('office-clippy');
const express =require('express');
var random = require('randomstring');
const app =express();
var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/minutesapp";
//var url ="mongodb://wcbcfilemanager:amrita123A@ds155587.mlab.com:55587/minutesapp";
var url="mongodb://heroku_z1bbr24v:n0qag9scnj80s7d5su2bgqejtf@ds153113.mlab.com:53113/heroku_z1bbr24v";
var assert= require('assert');
var html;
exports.upload = (req,res,err)=>{
    console.log(req.file);
}
exports.allFiles=(req,res,err)=>{
    var filename=[];

const Folder = 'server/uploads/';
//const Folder = './uploads/';

    fs.readdir(Folder, (err, files) => {
        files.forEach(file => {
        filename.push(file);
});
    res.send(filename);
    res.end();
})
}
exports.showFile=(req,res,err)=>{
    var filename= req.body.filename;
    console.log(filename);
mammoth.convertToHtml({path: "server/uploads/"+filename})
//   mammoth.convertToHtml({path: "./uploads/"+filename})
        .then(function(result){
            html = result.value; // The generated HTML
            res.send({"data":html,"filename":filename});
            var messages = result.messages; // Any messages, such as warnings during conversion
        })

        .done();
};

exports.category=(req,res,err)=>{
    var group=req.body.group;
    var code=req.body.code;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {group_name: group, code: code};
        db.collection("category").insertOne(myobj, function (err, result) {
            if (err) throw err;
            console.log(result)
            console.log("tag added successfully");
            if (err) {
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "tag successfully added", success: true, statusCode: 200});
            return;
        });
    });

};

exports.present=(req,res,err)=>{
    var present=req.body.presentName;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {present: present};
        db.collection("present").insertOne(myobj, function (err, result) {
            if (err) throw err;
            console.log(result)
            console.log("present added successfully");
            if (err) {
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "present successfully added", success: true, statusCode: 200});
            return;
        });
    });

};
exports.uploads=(req,res,err)=>{
    var created_at_file=req.body.created_at;
    var created_by_file=req.body.created_by;
    var meeting_name_file=req.body.meeting_name;
    var category_file=req.body.category;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = {created_at: created_at_file, created_by: created_by_file, meeting_name:meeting_name_file, file_category:category_file};
        db.collection("uploads").insertOne(myobj, function (err, result) {
            if (err) throw err;
            console.log(result)
            console.log("file data added successfully");
            if (err) {
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "file data successfully added", success: true, statusCode: 200});
            return;
        });
    });

};



exports.editFile =(req,res,err)=>{
    var data=req.body;
    var docx = officeClippy.docx;
    var exporter = officeClippy.exporter;
    var doc = docx.create();

var output = fs.createWriteStream('server/uploads/'+data.filename);
//   var output = fs.createWriteStream('./uploads/'+data.filename);

    var paragraph = docx.createParagraph(data.data);
    doc.addParagraph(paragraph);
    exporter.local(output, doc);
};

exports.login = (req,res,err)=>{
    var email = req.body.email;
    var password = req.body.password;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = { email: email, password: password };
        db.collection("users").find(myobj).toArray (function(err, result) {
            if (err) throw err;
            console.log(result);
            if(result.length > 0)
            {
                res.statusCode = 200;
                res.send({msg: "Login Successful", success: true, statusCode: 200, data:result});
            }
            else{
                res.statusCode = 401;
                res.send({msg: "user authentication failed", success: false, statusCode: 401});

            }
            db.close();
        });
    });
};

exports.newMeeting = (req,res,err)=>
{

    console.log("new meet");
    var meetingName = req.body.meetingName;
    var objId = req.body._id;
    var presents = req.body.presents;
    var minute = req.body.minute;
    var tag = req.body.tag;
    var created_at = new Date();
    var email = req.body.email;
    var name = req.body.name;
    var authToken = req.body.auth_token;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.statusCode = 500;
            res.statusText = "Internal Server Error";
            return;
        }
        if (objId) {
            console.log("Going here ")
            db.collection("meetings").update(
                {
                    "meeting_name": meetingName,
                    "email": email
                }, {
                    $push: {
                        "minutes": {
                            "bullet_points": minute,
                            "updated_by": name,
                            "tag": tag
                        }
                    }
                },
                function (err, result) {
                    if (err) {
                        res.statusCode = 500;
                        res.statusText = "Internal Server Error";
                        return;
                    }
                    res.statusCode = 200;
                    res.statusText = "ok";
                    res.send({msg: "successfully added minute", success: true, statusCode: 200});
                    return;
                });
        }
        else if(objId === undefined){
            console.log("going here 2");
            var meeting = [];
            var myobj = {
                meeting_name: meetingName,
                presents: presents,
                tag: tag,
                email: email,
                name: name,
                created_at: new Date(),
                auth_token: authToken
            }
            db.collection("meetings").insert(myobj, function (err, result) {
                if (err) {
                    res.statusCode = 500;
                    res.statusText = "Internal Server Error";
                    return;
                }
                db.collection("meetings").update(
                    {
                        "meeting_name": meetingName,
                        "email": email
                    }, {
                        $push: {
                            "minutes": {
                                "bullet_points": minute,
                                "updated_by": name,
                                "tag": tag
                            }
                        }
                    },
                    function (err, result) {
                        if (err) {
                            res.statusCode = 500;
                            res.statusText = "Internal Server Error";
                            return;
                        }
                        res.statusCode = 200;
                        res.statusText = "ok";
                        res.send({msg: "successfully added minute", success: true, statusCode: 200});
                        return;
                    });
                db.close();
            });
        }
        else{
            res.statusCode = 404;
            res.statusText = "Precondition Failed";
            return;
        }

    });


};

exports.signup = (req,res,err)=>{
    var name= req.body.name;
    var email= req.body.email;
    var password= req.body.password;
    var authToken = random.generate(16);
    MongoClient.connect(url,function (err, db) {
        if (err) {
            res.statusCode = 500;
            res.statusText = "Internal Server Error";
            return;
        }
        var  myobj ={ name: name, email:email, password:password,auth_token: authToken};
        var bsonQuery = {email: email};
        db.collection("users").find(bsonQuery).toArray(function (err,result) {
            if(result.length>0)
            {
                res.statusCode = 200;
                res.send({msg: "user with this email exists already", success: false, statusCode: 200});
                return;
            }
            else{
                db.collection("users").insertOne(myobj, function (err, res) {
                    if (err) {
                        res.statusCode = 500;
                        res.statusText = "Internal Server Error";
                        return;
                    }
                    db.close();
                });
                res.statusCode = 200;
                res.send({msg: "Signed up successfully", success: true, statusCode: 200});
                return;
            }
        });

    });

};
exports.fetchCategory = (req,res,err) => {
    console.log("Inside this function");
    var email = req.body.email;
    var authToken = req.body.auth_token;
    authenticateUser("users", email, authToken, function (response) {

        console.log("inside if");
        MongoClient.connect(url,function (err, db) {
            if(err){
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            db.collection("category").find({}).toArray(function (err,result) {
                if(err){
                    res.statusText = "Internal Server Error";
                    res.statusCode  = 500;
                    return;
                }
                res.statusCode = 200;
                res.statusText = "Ok";
                res.send({msg: "", success: true, data: result});
                return;
            });
            db.close();
        });
    }, function (error) {
        res.statusText = "Authentication Error";
        res.statusCode = 401;
        return;
    });
};

exports.fetchUploadFile = (req,res,err) => {
    console.log("Inside this function");
    var email = req.body.email;
    var authToken = req.body.auth_token;
    authenticateUser("users", email, authToken, function (response) {
        console.log("inside if");
        MongoClient.connect(url,function (err, db) {
            if(err){
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            db.collection("uploads").find({}).toArray(function (err,result) {
                if(err){
                    res.statusText = "Internal Server Error";
                    res.statusCode  = 500;
                    return;
                }
                res.statusCode = 200;
                res.statusText = "Ok";
                res.send({msg: "", success: true, data: result});
                return;
            });
            db.close();
        });
    }, function (error) {
        res.statusText = "Authentication Error";
        res.statusCode = 401;
        return;
    });
};

exports.fetchPresent = (req,res,err) => {
    console.log("Inside this function");
    var email = req.body.email;
    var authToken = req.body.auth_token;
    authenticateUser("users", email, authToken, function (response) {
        console.log("inside if");
        MongoClient.connect(url,function (err, db) {
            if(err){
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            db.collection("present").find({}).toArray(function (err,result) {
                if(err){
                    res.statusText = "Internal Server Error";
                    res.statusCode  = 500;
                    return;
                }
                res.statusCode = 200;
                res.statusText = "Ok";
                res.send({msg: "", success: true, data: result});
                return;
            });
            db.close();
        });
    }, function (error) {
        res.statusText = "Authentication Error";
        res.statusCode = 401;
        return;
    });
};
exports.fetchMinutes = (req,res,err) => {
    console.log("Inside this function");
    var email = req.body.email;
    var authToken = req.body.auth_token;
    authenticateUser("users", email, authToken, function (response) {
        console.log("inside if");
        MongoClient.connect(url,function (err, db) {
            if(err){
                res.statusCode = 500;
                res.statusText = "Internal Server Error";
                return;
            }
            db.collection("meetings").find({}).toArray(function (err,result) {
                if(err){
                    res.statusText = "Internal Server Error";
                    res.statusCode  = 500;
                    return;
                }
                res.statusCode = 200;
                res.statusText = "Ok";
                res.send({msg: "", success: true, data: result});
                return;
            });
            db.close();
        });
    }, function (error) {
        res.statusText = "Authentication Error";
        res.statusCode = 401;
        return;
    });
};

exports.editMinute = (req,res,next) => {
    var email = req.body.email;
    var authToken = req.body.auth_token;
    var desc = req.body.description;
    var meetingName = req.body.meetingName;
    var bulletPoint = req.body.minute;
    var tag = req.body.tag;
    var name = req.body.name;
    var i =1;
   console.log(meetingName);
    MongoClient.connect(url,function (err, db) {
        if(err){
            res.statusCode = 500;
            res.statusText = "Internal Server Error";
            return;
        }
        db.collection("meetings").update(
            {
                "meeting_name": meetingName,
                "minutes.bullet_points": bulletPoint
            }, {
                $set:
                    {
                        'minutes.$':{
                            "bullet_points": desc,
                            "tag": tag,
                            "updated_by": name,
                        }
                    }
            }, function (err,result) {
                if(err)
                {
                    res.statusText = "Internal Server Error";
                    res.statusCode = 500;
                    return;
                }
                console.log(result);
                res.statusText = "ok";
                    res.statusCode = 200;
                    res.send({msg:"Successfully edited minute", success: true, statusCode:200});
                    return;
            });


        db.close();
    });



};
function authenticateUser(tableName, email, authToken, callback){
    console.log("I am being called");
    var bson = {email: email, auth_token: authToken};
    console.log(bson);
    MongoClient.connect(url,function (err, db) {

        db.collection(tableName).find(bson).toArray(function (err,result) {

            if(err)
            {

            callback(false);
            }
            if(result.length > 0){
              callback(true);
            }
            else{
                callback(false);
            }
        });
    });
}