var db;

exports.getDb = function(database){
	db = database;
}

exports.profile = function(req,res){
	db.collection('users').findOne({username:req.session.user,password:req.session.pass},function(err,doc){
		var number;
		if(!err){
			var d=(new Date(doc.date)).toLocaleDateString();
			db.collection('polls').count({creator:req.session.user},function(err,count){
				if(!err){
					//count=count.replace('<','');
					//count=count.replace('>','');
					res.render('profile',{doc:{user:String(doc.username),pass:doc.password,email:doc.email,createdOn:d,number:parseInt(count)}});
				}
			});
		}
	});
}

exports.edit = function(req,res){
		res.render('edit');
}

exports.postEdit = function(req,res){
	var user=req.body.user;
	var email=req.body.email;
	db.collection('users').update({username:req.session.user},{$set:{username:user,email:email}},function(err,result){
		if(!err){
			req.session.user=user
			res.redirect('/');
		}
	});
}