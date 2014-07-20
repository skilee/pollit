var db;
var bson;
exports.getBson = function(BSON){
	bson = BSON;
}
exports.getDb = function(database){
	db = database;
}

exports.root = function(req,res){
	db.collection('polls').find().toArray(function(err,items){
		res.render('polls',{items:items});
	});
}

exports.page = function(req,res){
	var id=req.param('id');
	db.collection('comments').find({pollId:id}).sort({_id:-1}).toArray(function(err,comments){
		db.collection('polls').findOne({_id:new bson.ObjectID(id)},function(err,doc){
			res.render('apoll',{doc:doc,comments:comments});
		});
	});
}

exports.create = function(req,res){
	res.render('create');
}

exports.postCreate = function(req,res){
	var question=req.body.question;
	var tags=req.body.tags;
	tags = tags.toLowerCase().split(',');
	var date=(new Date()).toJSON();
	var username=req.session.user;
	var id;
		
	poll={
		creator:username,
		question:question,
		createdOn:date,
		tags:tags,
		up:0,
		down:0
	}
	db.collection('polls').insert(poll,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.redirect('/mypolls');
		}
		});

}

exports.up = function(req,res){
	var mypollsUp=[];
	var mypollsDown=[];
	var id=req.param('id');
	db.collection('users').findOne({username:req.session.user},function(err,user){
		mypollsUp=user.mypollsUp;
		mypollsDown=user.mypollsDown;
		if(mypollsUp.indexOf(id)==-1&&mypollsDown.indexOf(id)==-1){
			db.collection('polls').update({_id:new bson.ObjectID(id)},{$inc:{up:1}},function(err,result){
				if(!err){
					db.collection('users').update({username:req.session.user},{$push:{mypollsUp:id}},function(err,result){
							if(!err){
								res.send(' ');
							}
					});
				}
			});
		}else{
			res.send('');
		}
	
});
}

exports.down = function(req,res){
	var mypollsDown=[];
	var mypollsUp=[];
	var id=req.param('id');
	db.collection('users').findOne({username:req.session.user},function(err,user){
		mypollsDown=user.mypollsDown;
		mypollsUp=user.mypollsUp;
		if(mypollsDown.indexOf(id)==-1&&mypollsUp.indexOf(id)==-1){
			db.collection('polls').update({_id:new bson.ObjectID(id)},{$inc:{down:1}},function(err,result){
				if(!err){
					db.collection('users').update({username:req.session.user},{$push:{mypollsDown:id}},function(err,result){
							if(!err){
								res.send(' ');
							}
					});
				}
			});
		}else{
			res.send('');
		}
	
	});
	
}

exports.comment = function(req,res){
	var id=req.param('id');
	var comment=req.query.comment;
	var commentObj={
		pollId:id,
		date:(new Date()).toLocaleDateString(),
		commentor:req.session.user,
		comment:comment
	}
	db.collection('comments').insert(commentObj,function(err,result){
		if(!err){
			res.send(result);	
		}else{
			res.send('');
		}
	});
}

