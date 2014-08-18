var db;
var pass = require('pwd');
exports.getDb = function (database){
	db = database;
}

exports.login = function (req,res){

	if(req.session&&req.session.user){		
		res.redirect('/');
	}
	else{		
		res.render('login');
	}
}

exports.postLog = function (req,res){

	var user = req.body.user;
	var password = req.body.pass;
	db.collection('users').find({username:user}).toArray(function(err,users){
		if(users.length==1){
			var user = users[0];
			if(!err){
				pass.hash(password, user.salt, function(err,hash){
					if(user.hash == hash){
						req.session.user = user.username;
						res.redirect('profile');
					}
					else{
						res.redirect('login');
					}
				});
			}	
		}else{
			res.redirect('/login');
		}		
	});

}
exports.reg = function (req,res){

	res.render('register');
}

exports.regPost = function (req,res){

	var user={

	}

	var password = req.body.pass;
	pass.hash(password,function(err,salt,hash){
		user.salt = salt;
		user.hash = hash;
		user.username = req.body.user;
		user.email = req.body.email;
		user.date = (new Date()).toJSON();
		user.myPollsVoted = [];
		db.collection('users').insert(user,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.redirect('login');
		}
	});
		
	});

	
}
exports.userCheck = function(req,res){
	var user=req.query.username;
	db.collection('users').find({username:user}).toArray(function(err,users){
		if (users.length == 0) {
			res.send('')
		}else{
			res.send(' ');
		}
	});
}
