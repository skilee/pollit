var db;
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

	var found=false;
	var user=req.body.user;
	var pass=req.body.pass;
	db.collection('users').find({username:user,password:pass}).toArray(function(err,items){
		if(!err){
			for(var i=0;i<items.length;i++){
				if(items[i].username==user&&items[i].password==pass){
					found = true;
					req.session.user=items[i].username;
					req.session.pass=items[i].password;
				}
			}
			}else{
				console.log(err);
			}
			if(found==true){
				res.redirect('/profile');
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
		username:req.body.user,
		password:req.body.pass,
		email:req.body.email,
		date:(new Date()).toJSON(),
		mypollsUp:[' '],
		mypollsDown:[' ']
	}
	db.collection('users').insert(user,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.redirect('login');
		}
	});
}
exports.userCheck = function(req,res){
	var user=req.query.username;
	db.collection('users').find({username:user}).toArray(function(err,users){
		if (users.length==0) {
			res.send('')
		}else{
			res.send(' ');
		}
	});
}
