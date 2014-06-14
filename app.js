var express = require('express');
var app=express();
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var cookieSession=require('cookie-session');
var port = process.env.PORT || 3000;
app.set('title','Pollit');
app.locals.title='Pollit';
var MongoClient=require('mongodb').MongoClient;
var db;//go get access to db outside connect
MongoClient.connect("mongodb://pollit:skillandlearn@kahana.mongohq.com:10083/pollit",function(err,database){
	if(!err){
		console.log("We are connected");
		db=database;
	}
});
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
		res.render('home2');
	}
	else{
		res.render('home');
	}
});
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
		date:(new Date()).toJSON()
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
app.get('/profile',isLoggedIn,function(req,res){
	db.collection('users').findOne({username:req.session.user,password:req.session.pass},function(err,doc){
		if(!err){
			res.render('profile',{doc:{user:String(doc.username),pass:doc.password,email:doc.email}});
		}
	});
});
app.get('/category',isLoggedIn,function(req,res){
	db.collection('category').find().toArray(function(err,items){
		res.render('category',{items:items});
	});
});
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
	db.collection('users').findOne({username:req.session.user,password:req.session.pass},function(err,doc){
		if(!err){
			id=doc._id;
		
	poll={
		creatorId:id,
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

	}
});
});
app.get('/logout',function(req,res){    
	req.session=null;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    res.redirect('/');   
});/*
app.get('/islogged',function(req,res){
	if(req.session&&req.session.user){
		res.send('true');
	}else{
		res.send('false');
	}
});*/
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
app.get('/search',function(req,res){
	var query=req.query.search;
	a=query.toLowerCase().split(' ');
	db.collection('polls').find({tags:{$in:a}}).toArray(function(err,items){
		res.send(items);
	});
});
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
app.get('/mypolls',function(req,res){
	db.collection('polls').find({username:req.session.user}).toArray(function(err,items){
		res.render('mypoll',{polls:items});
	});
});
var server = app.listen(port,function(){
	console.log('Listening on port %d',port);
});