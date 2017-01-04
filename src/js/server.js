var express = require('express');
//var multer  = require('multer');
//var mongoFactory = require('mongo-factory');
//var apkUpload = require('./uploadapk');
//var download = require('./download');
//var user = require('./user');

var app = express();

var homeDir = process.env.HOME;
app.use(multer({ dest: homeDir+'/server/apps/'}));

uploadsCollection  = null;
usersCollections   = null;
//dbRef              = null;
mongoFactory.getConnection('mongodb://localhost:27017').then(function(db) {
	uploadsCollection  = db.collection('apps');
	convertsCollection = db.collection('convertedapps');
	usersCollections   = db.collection('users');
	db.createCollection('requests', {capped: true, size: 10000000});
	queueCollection    = db.collection('requests');
	queueCollection.ensureIndex({'apkid':1,'conversionid':1,'platform':1,'arch':1,'status':1},{unique:true, background:true, w:1},function(err, cIndexName){
		if(err == null)    		
			console.log(cIndexName);
		else
			console.log(err);
	});
	queueCollection.ensureIndex({'status':1},{unique:false, background:true, w:1},function(err, sIndexName){
		if(err == null)
                        console.log(sIndexName);
                else
                        console.log(err);
	});
	convertsCollection.ensureIndex({'apkid':1},{unique:true, background:true, w:1},function(err, apkIndexName){
                if(err == null)
                        console.log(apkIndexName);
                else
                        console.log(err);
        });
  })
  .catch(function(err) {
	console.error(err);
  });

//Actual services to client
app.post('/uploadAPK', apkUpload.uploadAPK);
app.get('/download/:conversionId', download.downloadApp);
app.get('/createUser/:eMail/:userName',user.createUser);
app.listen(9990);

console.log('Server started to listen on port 9990');
