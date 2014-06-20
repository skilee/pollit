var express = require('express');
var app=express();
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var cookieSession=require('cookie-session');
var port = process.env.PORT || 3000;
app.set('title','Pollit');
app.locals.title='Pollit';


//================================
// DataBase Related
//================================


var mongo=require('mongodb');
var bson=mongo.BSONPure;
var MongoClient=require('mongodb').MongoClient;
var db;//go get access to db outside connect
MongoClient.connect("mongodb://pollit:skillandlearn@kahana.mongohq.com:10083/pollit",function(err,database){
	if(!err){
		console.log("We are connected");
		db=database;
	}
});


//================================
// Middleware
//================================

app.use(bodyParser());
app.use(cookieParser('SueCrEeT'));
app.use(cookieSession({keys:['sec1','sec2']}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

//middleware to check if user logged in or not
var isLoggedIn = function(req, res, next) {
  if (req.session && req.session.user)
    next(); // user logged in, so pass
  else
    res.redirect('/login'); // not logged in, redirect to login page
};	
app.get('/',function(req,res){
	if(req.session&&req.session.user){
		db.collection('polls').find().sort({_id:-1}).limit(3).toArray(function(err,items){
			res.render('home2',{items:items});
	
		});
	}
	else{
		db.collection('polls').find().sort({_id:-1}).limit(3).toArray(function(err,items){
			res.render('home',{items:items});
	
		});
	}
});



//================================
// Registration and Login
//================================



app.get('/login',function(req,res){
	if(req.session&&req.session.user){		
		res.redirect('/');
	}
	else{		
		res.render('login');
	}
});
app.post('/login',function(req,res){
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
});

app.post('/register',function(req,res){
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
});
app.get('/register',function(req,res){
	res.render('register');
});
app.get('/usercheck',function(req,res){
	var user=req.query.username;
	db.collection('users').find({username:user}).toArray(function(err,users){
		if (users.length==0) {
			res.send('')
		}else{
			res.send(' ');
		}
	});
});

//================================
// Profile
//================================



app.get('/profile',isLoggedIn,function(req,res){
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
});




//================================
// Create Polls
//================================



app.get('/create',isLoggedIn,function(req,res){
	res.render('create');
});
app.post('/create',isLoggedIn,function(req,res){
	var question=req.body.question;
	var tags=req.body.tags;
	tags=tags.toLowerCase().split(',');
	var date=(new Date()).toJSON();
	var username=req.session.user;
	var id;
		
	poll={
		creator:username,
		question:question,
		createdOn:date,
		tags:tags,
		up:1,
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

	});


//================================
// Logout
//================================



app.get('/logout',function(req,res){    
	req.session=null;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    res.redirect('/');   
});

//================================
// To Remove(from skile, for reference)
//================================

app.get('/category/:title',function(req,res){
	var title=req.param('title');
	db.collection('category').findOne({title:title},function(err,item){
		res.render('catpage',{category:{title:title,description:item.description}});
	});
});
app.get('/links',function(req,res){
	db.collection('links').find().toArray(function(err,items){
		if(err){
			res.send(err);
		}else{
			res.render('links',{items:items});
		}
	});
});
app.get('/links/:category',function(req,res){	
	var  category=req.param('category');	
	var title = new RegExp("^" + category + "$",'i');
	db.collection('links').find({category:title}).toArray(function(err,items){
		if(err){
			res.send(err);
		}else{
			res.render('catlinks',{items:items,category:category});
		}
	});
});
app.post('/links',isLoggedIn,function(req,res,next){
	var url=req.body.url;
	var title=req.body.title;
	var category=req.body.category;
	var description=req.body.description;
	var tags=req.body.tags.toLowerCase().split(',');
	tags.concat(url.toLowerCase().split('/'));
	tags.concat(description.toLowerCase().split(' '));
	tags.push(category.toLowerCase());
	tags.concat(title.toLowerCase().split(' '));
	var a = new RegExp("^" + category + "$",'i');
	db.collection('category').find({title:a}).toArray(function(err,item){
		if(item.length==0){
			var error="Category "+category+" not found."
			res.render('error',{error:error});
			res.end();
			next(err);
		}
	var id=item._id;
	var link={
		title:title,
		url:url,
		category:category,
		description:description,
		catId:id,
		username:req.session.user,
		tags:tags
	}
	db.collection('links').insert(link,function(err,result){
		if(err){
			res.send(err);
		}else{
			res.redirect('/links/'+category);
		}
	});
	});
});



//================================
// Search
//================================



app.get('/search',function(req,res){
	var query=req.query.search;
	a=query.toLowerCase().split(' ');
	db.collection('polls').find({tags:{$in:a}}).toArray(function(err,items){
		res.send(items);
	});
});


//================================
// Editing
//================================



app.get('/edit',isLoggedIn,function(req,res){
		res.render('edit');
});
app.get('/ajedit',isLoggedIn,function(req,res){
	db.collection('users').findOne({username:req.session.user,password:req.session.pass},function(err,doc){
		res.send(doc);	
	});
});
app.post('/edit',isLoggedIn,function(req,res){
	user=req.body.user;
	email=req.body.email;
	db.collection('users').update({username:req.session.user},{$set:{username:user,email:email}},function(err,result){
		if(!err){
			req.session.user=user
			res.redirect('/');
		}
	});
});



//================================
// Polls
//================================



app.get('/mypolls',function(req,res){
	db.collection('polls').find({creator:req.session.user}).toArray(function(err,items){
		res.render('mypoll',{items:items});
	});
});



//================================
// Upvote
//================================



app.get('/up/:id',function(req,res){
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
});



//================================
// Downvote
//================================



app.get('/down/:id',function(req,res){
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
	
});
var server = app.listen(port,function(){
	console.log('Listening on port %d',port);
});