var db;
exports.getDb = function (database){
	db = database;
}

exports.search = function(req,res){
	var query=req.query.search;
	a=query.toLowerCase().split(' ');
	db.collection('polls').find({tags:{$in:a}}).toArray(function(err,items){
		res.send(items);
	});
}
exports.edit = function(req,res){
	db.collection('users').findOne({username:req.session.user,password:req.session.pass},function(err,doc){
		res.send(doc);	
	});
}