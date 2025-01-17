const async = require('async'),
    request = require('request'),
    fs = require('fs');
const mammoth = require("mammoth");
var officeClippy = require('office-clippy');
const express =require('express');
var random = require('randomstring');
var mime = require('mime');

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

exports.deleteTag=(req,res,err)=>{
var code=req.body.code;
    MongoClient.connect(url, function(err, db) {
        var bsonQuery={code:code};
        db.collection("category").remove(bsonQuery,function (err, result) {
            console.log(err);
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "tag deleted successfully", success: true, statusCode: 200});
            return;
            //var item = db.collection("uploads").findOne(bsonQuery)

        });
        db.close();
    });
}
exports.deletePresent=(req,res,err)=>{
    var present=req.body.present;
    MongoClient.connect(url, function(err, db) {
        var bsonQuery={present:present};
        db.collection("present").remove(bsonQuery,function (err, result) {
            console.log(err);
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "Present deleted successfully", success: true, statusCode: 200});
            return;
            //var item = db.collection("uploads").findOne(bsonQuery)

        });
        db.close();
    });
}

exports.deleteFile=(req,res,err)=>{
    var filename=req.body.file_name;

    MongoClient.connect(url, function(err, db) {
        var bsonQuery={file_name:filename};
        db.collection("uploads").remove(bsonQuery,function (err, result) {
            fs.unlink("./uploads/" + filename);
            console.log(err);
            res.statusCode = 200;
            res.statusText = "ok";
            res.send({msg: "file deleted successfully", success: true, statusCode: 200});
            return;

        });
        var bsonmeet={meetings: {bullet_points:filename}};
        db.collection("meetings").remove(bsonmeet,function (err, result) {
            console.log(err);
        });
        db.close();
    });
}

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
    var created_at_file=req.body.datas.created_at;
    var created_by_file=req.body.datas.created_by;
    var meeting_name_file=req.body.datas.meeting_name;
    var email = req.body.datas.email;
    var name = req.body.datas.name;
    var authToken = req.body.datas.auth_token;
    var tag=req.body.datas.category;
    var filename_file= req.file.filename;
    var codeID = tag.code;
    var count = 0;
    var startsWith = parseInt(req.body.datas.start_with,10);
    var endsWith = parseInt(req.body.datas.ends_with,10);
    if(endsWith <= startsWith)
    {
        res.statusCode = 402;
        res.statusText = "Preconditioned Failed";
        res.send({msg: "Your end minute cannot be lesser or equal than start minute.", success: false})
        return
    }
    else {
        console.log("hello you" + req.file.filename)
        var filename = req.file.filename;
        var extension = mime.extension(req.file.mimetype);
        if (extension !== "docx") {
            res.statusCode = 402;
            res.statusText = "Precondition Failed";
            res.send({msg: "Please upload a docx extension only", success: false});
            return
        }
        else {
            console.log(startsWith);
            // console.log(req.body);
            var myobjson = {
                meeting_name: meeting_name_file,
                presents: created_by_file,
                tag: tag,
                email: email,
                name: created_by_file,
                created_at: new Date(),
                auth_token: authToken
            }
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var myobj = {
                    created_at: created_at_file,
                    created_by: created_by_file,
                    meeting_name: meeting_name_file,
                    tag: tag,
                    file_name: filename_file
                };
                var findFile = {file_name: filename_file}
                db.collection("uploads").find(findFile).toArray(function (err, result) {
                    if (result.length > 0) {
                        res.statusCode = 200;
                        res.send({
                            msg: "file with this name already exists! please rename your file and upload",
                            success: false,
                            statusCode: 200
                        });
                        return;
                    }
                    else {
                        db.collection("uploads").insertOne(myobj, function (err, result) {
                            if (err) throw err
                            console.log("file data added successfully");
                            if (err) {
                                res.statusCode = 500;
                                res.statusText = "Internal Server Error";
                                return;
                            }
                            console.log("hello")
                            db.collection("meetings").find({"tag.code": tag.code}).toArray(function (err, result) {

                                if (err) {
                                    res.statusText = "Internal Server Error";
                                    res.statusCode = 500;
                                    return;

                                }
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].minutes === undefined) {
                                            count = count + 0;
                                        }
                                        else {
                                            count = count + result[i].minutes.length;

                                        }
                                    }
                                    console.log("the length is: " + count);
                                    count = endsWith;
                                    console.log("count is" + count);
                                    codeID = codeID + " - 00" + count;
                                    db.collection("meetings").insert(myobjson, function (err, result) {
                                        if (err) {
                                            res.statusCode = 500;
                                            res.statusText = "Internal Server Error";
                                            return;
                                        }
                                    });
                                    db.collection("meetings").update(
                                        {
                                            "meeting_name": meeting_name_file,
                                            "email": email
                                        }, {
                                            $push: {
                                                "minutes": {
                                                    "starts_with": startsWith,
                                                    "bullet_points": filename_file,
                                                    "updated_by": created_by_file,
                                                    "tag": tag,
                                                    "codeID": codeID,
                                                    "ends_with": endsWith
                                                }
                                            }
                                        },
                                        function (err, result) {
                                            if (err) {
                                                res.statusCode = 500;
                                                res.statusText = "Internal Server Error";
                                                return;
                                            }
                                        });

                                    myobjson.count = count;
                                }
                                else {
                                    console.log("no data");
                                    count = count + endsWith;
                                    codeID = codeID + " - 00" + count;
                                    db.collection("meetings").insert(myobjson, function (err, result) {
                                        if (err) {
                                            res.statusCode = 500;
                                            res.statusText = "Internal Server Error";
                                            return;
                                        }
                                    });

                                    db.collection("meetings").update(
                                        {
                                            "meeting_name": meeting_name_file,
                                            "email": email
                                        }, {
                                            $push: {
                                                "minutes": {
                                                    "stars_with": startsWith,
                                                    "bullet_points": filename_file,
                                                    "updated_by": created_by_file,
                                                    "tag": tag,
                                                    "codeID": codeID,
                                                    "ends_with": endsWith
                                                }
                                            }
                                        },
                                        function (err, result) {
                                            if (err) {
                                                res.statusCode = 500;
                                                res.statusText = "Internal Server Error";
                                                return;
                                            }
                                        });
                                      db.close();

                                }
                                res.statusCode = 200;
                                res.statusText = "ok";
                                res.send({msg: "file data successfully added", success: true, statusCode: 200});
                                return;
                            })



                        });

                    }

                });

            });
        }
    }
};



exports.editFile =(req,res,err)=>{
    var data=req.body;
    var docx = officeClippy.docx;
    var exporter = officeClippy.exporter;
    var doc = docx.create();

//var output = fs.createWriteStream('server/uploads/'+data.filename);
   var output = fs.createWriteStream('./uploads/'+data.filename);

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
    var codeID = req.body.codeID;
    var count = 0;
    var count1 = 0;
    var count2 = 0;
    var count3 = 0;
    console.log(codeID);
    MongoClient.connect(url, function (err, db) {
        if (err) {
            res.statusCode = 500;
            res.statusText = "Internal Server Error";
            return;
        }
        if (objId) {
            console.log("Going here ")

            db.collection("meetings").find({"tag.code": tag.code}).toArray(function (err, result) {

                if (err) {
                    res.statusText = "Internal Server Error";
                    res.statusCode = 500;
                    return;

                }
                if(result.length>0){
                    var j = 0;
                    for(var i=0; i<result.length; i++) {
                        if(result[i].minutes === undefined)
                        {
                            if(i >= j) {
                                console.log("In first");
                                count = count + 0;
                            }
                        }
                        else if(result[i].minutes && result[i].minutes[0].ends_with === undefined) {
                            if(i >= j) {
                                console.log("In second");
                                count = count + result[i].minutes.length;
                            }

                        }
                        else if(result[i].minutes && result[i].minutes[0].ends_with){
                            if(i >= j) {
                                console.log("In third");
                                count = result[i].minutes[0].ends_with;
                                j + 1;
                            }
                        }
                    }
                    console.log("the length is: "+count);
                    count = count+1;
                    codeID = codeID+ " - 00"+ count;
                    console.log(codeID);
                    db.collection("meetings").update(
                        {
                            "meeting_name": meetingName,
                            "email": email
                        }, {
                            $push: {
                                "minutes": {
                                    "bullet_points": minute,
                                    "updated_by": name,
                                    "codeID": codeID

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
                            res.send({msg: "successfully added minute", success: true, statusCode: 200, count: count});
                            return;
                        });
                }
                else {
                    console.log("no data");
                    codeID = req.body.codeID+ " - 00"+ 1;
                    console.log("else"+codeID);
                    db.collection("meetings").update(
                        {
                            "meeting_name": meetingName,
                            "email": email
                        }, {
                            $push: {
                                "minutes": {
                                    "bullet_points": minute,
                                    "updated_by": name,
                                    "codeID": codeID

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
                            res.send({msg: "successfully added minute", success: true, statusCode: 200, count: count});
                            return;
                        });
                }
            });


        }
        else if (objId === undefined) {
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

            db.collection("meetings").find({"tag.code": tag.code}).toArray(function (err, result) {

                if (err) {
                    res.statusText = "Internal Server Error";
                    res.statusCode = 500;
                    return;

                }
                if(result.length>0){
                    for(var i=0; i<result.length; i++) {
                        if(result[i].minutes === undefined)
                        {
                            count1 = count1+0;
                        }
                        else if(result[i].minutes && result[i].minutes[0].ends_with === undefined) {
                            count2 = count2 + result[i].minutes.length;

                        }
                        else if(result[i].minutes && result[i].minutes[0].ends_with){
                            count3 = count3+result[i].minutes[0].ends_with;
                        }
                    }
                    console.log("the length is: "+count);
                    count = count1+count2+count3;
                }
                else {
                    console.log("no data");
                }
            })

            db.collection("meetings").insert(myobj, function (err, result) {
                if (err) {
                    res.statusCode = 500;
                    res.statusText = "Internal Server Error";
                    return;
                }


                //     db.collection("meetings").update(
                //         {
                //             "meeting_name": meetingName,
                //             "email": email
                //         }, {
                //             $push: {
                //                 "minutes": {
                //                     "bullet_points": minute,
                //                     "updated_by": name,
                //                     "tag": tag
                //                 }
                //             }
                //         },
                //         function (err, result) {
                //             if (err) {
                //                 res.statusCode = 500;
                //                 res.statusText = "Internal Server Error";
                //                 return;
                //             }
                //             res.statusCode = 200;
                //             res.statusText = "ok";
                //             res.send({msg: "successfully added minute", success: true, statusCode: 200});
                //           return;
                // });
                db.close();
                res.statusCode = 200;
                res.send({msg: "New meeting is created", success: true, data: myobj});
                return;
            });
        }

        else {
            res.statusCode = 404;
            res.statusText = "Precondition Failed";
            return;
        }


    });
}

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
    var codeID = req.body.codeID;
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
                            "codeID": codeID
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
exports.sendEndVal = (req,res,next) => {
var email = req.body.email;
var authToken = req.body.auth_token;
var tag = req.body.tag;
console.log(tag);
    MongoClient.connect(url,function (err, db) {

        db.collection("meetings").find({'tag.code': tag.code}).toArray(function (err,result) {
            if(result.length>0){
                console.log(result[result.length-1]);
                 var min  = result[result.length-1].minutes;
                 var len = min.length-1;
               var  data = {
                   ends_with: result[result.length-1].minutes[len].codeID
                }
                res.statusCode = 200;
                res.statusText = "ok";
                res.send({msg: "found last minute", success: true, data: data});
            }
            else{
                res.statusText =200;
                res.statusText = "ok";
                res.send({msg: "Data not found", success: false});
            }
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