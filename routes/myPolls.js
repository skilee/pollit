var db;
var bson;
exports.getBson = function(BSON){
	bson = BSON;
}
exports.getDb = function (database){
	db = database;
}

exports.root = function(req,res){
	db.collection('polls').find({creator:req.session.user}).toArray(function(err,items){
		res.render('mypoll',{items:items});
	});
}

exports.edit = function(req,res){
	var id=req.param('id');
	db.collection('polls').findOne({_id:new bson.ObjectID(id)},function(err,poll){
		res.render('polledit',{poll:poll});
	});
}

exports.postEdit = function(req,res){
	var id=req.param('id');
	var question=req.body.question;
	var tags=req.body.tags;
	db.collection('polls').findOne({_id:new bson.ObjectID(id)},function(err,poll){
		if(poll.creator===req.session.user){
			db.collection('polls').update({_id:new bson.ObjectID(id)},{$set:{question:question,tags:tags}},function(err,result){
				if(!err){
					res.redirect('/mypolls');
				}
			});
		}else{
			res.send('you did not create the poll, so you cannot edit it :/ ');
		}
			
	});
}

exports.remove = function(req,res){
	var id=req.param('id');
	var user=req.session.user;
	db.collection('polls').findOne({creator:user},function(err,doc){
		if(doc.creator===user){
			db.collection('polls').remove({_id:new bson.ObjectID(id)},{justOne:true},function(err,result){
				res.redirect('/mypolls');
			});
		}else{
			res.send('not deleted due to some error');
		}
	});
}