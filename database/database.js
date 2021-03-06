var mongo=require('mongodb');
var bson=mongo.BSONPure;
var index = require('../routes');
var users = require('../routes/users');
var profile = require('../routes/profile');
var polls = require('../routes/polls');
var myPolls = require('../routes/myPolls');
var ajax = require('../routes/ajax');
var category = require('../routes/category');
var MongoClient=require('mongodb').MongoClient;
var dbUri = 'mongodb://pollit:upoll@kahana.mongohq.com:10066/pollit'
module.exports = MongoClient.connect(dbUri,function(err,database){
	if(!err){
		console.log("We are connected");
		index.getDb(database);
		users.getDb(database);
		profile.getDb(database);
		polls.getDb(database);
		myPolls.getDb(database);
		ajax.getDb(database);
		category.getDb(database);
	}else{
		console.log('Database not connected');
	}
});

//BSON
myPolls.getBson(bson);
polls.getBson(bson);