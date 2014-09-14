var db;
var pass = require('pwd');
exports.getDb = function (database){
	db = database;
}

exports.search = function(req,res){
	var query=req.query.search;
	console.log(req.query);
	a=query.toLowerCase().split(' ');
	db.collection('polls').find({tags:{$in:a}}).toArray(function(err,items){
		res.send(items);
	});
}
exports.edit = function(req,res){
	db.collection('users').findOne({username:req.session.user},function(err,user){
			res.send(user);
	});
}

exports.login = function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	db.collection('users').findOne({username:username},function(err,user){
		if(user){
			if(user!=null){
				pass.hash(password,user.salt,function(err,hash){
					if(user.hash == hash){						
						req.session.user = user.username;
						res.send('yes');
					}else{						
						res.send('no');
					}
				});		
			}
		}else{
				res.send('no2');
				}
		if (err) {
			console.error(err);
		}
	});
}


exports.register = function (req,res){

	var user={

	}

	var password = req.body.password;
	var conPassword = req.body.conPassword;
	console.log(password===conPassword);
	pass.hash(password,function(err,salt,hash){
		user.salt = salt;
		user.hash = hash;
		user.username = req.body.username;
		user.email = req.body.email;
		user.date = (new Date()).toJSON();
		user.myPollsVoted = [];
		console.log(user);
		db.collection('users').insert(user,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.redirect('/');
		}
	});
		
	});

	
}