var express = require('express');
var app = express();
// var cookieParser=require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var port = process.env.PORT || 3000;
var index = require('./routes');
var users = require('./routes/users');
var profile = require('./routes/profile');
var polls = require('./routes/polls');
var myPolls = require('./routes/myPolls');
var ajax = require('./routes/ajax');
var category = require('./routes/category');
app.set('title','Pollit');
app.locals.title = 'Pollit';

//================================
// Middleware
//================================

app.use(bodyParser());
app.use(session({secret:'PoLLit_awesome',cookie:{secret:true}}));
// MAY ADD COOKIE PARSER
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

//middleware to check if user logged in or not
var isLoggedIn = function(req, res, next) {
  if (req.session && req.session.user)
    next(); // user logged in, so pass
  else{
  	res.redirect('/'); // not logged in, redirect to login page
  }    
};



//================================
// Database
//================================

var database = require('./database/database');


//================================
// Index.js
//================================

app.get('/',index.root);
app.get('/page/:pageNo',index.page);


//================================
// Users.js
//================================

app.post('/login',ajax.login);
app.post('/register',ajax.register);
app.get('/register',users.reg);
app.get('/usercheck',users.userCheck);

//================================
// Profile.js
//================================



app.get('/profile',isLoggedIn,profile.profile);




//================================
// Create Polls
//================================



app.get('/create',isLoggedIn,polls.create);
app.post('/create',isLoggedIn,polls.postCreate);

//================================
// Logout
//================================



app.get('/logout',isLoggedIn,index.logout);


//================================
// Search
//================================



app.get('/search',isLoggedIn,ajax.search);


//================================
// Editing
//================================



app.get('/edit',isLoggedIn,profile.edit);

app.get('/ajedit',isLoggedIn,ajax.edit);


app.post('/edit',isLoggedIn,profile.postEdit);

app.get('/mypolls/edit/:id',isLoggedIn,myPolls.edit);

app.post('/mypolls/edit/:id',isLoggedIn,myPolls.postEdit);




//================================
// Polls
//================================




app.get('/mypolls',isLoggedIn,myPolls.root);



//================================
// vote
//================================



app.get('/vote/:id',isLoggedIn,polls.vote);



//================================
// Remove from mypolls
//================================


app.get('/mypolls/rem/:id',isLoggedIn,myPolls.remove);




//================================
// All Polls
//================================


app.get('/polls',isLoggedIn,polls.root);
app.get('/polls/pages/:pageNo',isLoggedIn,polls.pagination);



//================================
// each poll
//================================



app.get('/polls/:id',isLoggedIn,polls.page);



//================================
// Comments
//================================



app.get('/comment/:id',isLoggedIn,polls.comment);


//================================
// Category
//================================

app.get('/category',isLoggedIn,category.all);

app.get('/category/:catName',isLoggedIn,category.this);

app.get('/createCategory',isLoggedIn,category.create);

app.post('/createCategory',isLoggedIn,category.saveCategory);

app.get('/catSearch',isLoggedIn,category.ajSearch);

//================================
// API
//================================

app.get('/api',function(req,res){
	res.render('api');

});


//================================
// 404 page
//================================

app.get('*',function(req,res){
	res.send('What you playin at! With great power comes great responsibility <br><br><br><a href="/">Back!<a/>');
});


var server = app.listen(port,function(){
	console.log('Listening on port %d',port);
});