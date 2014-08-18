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
  else
    res.redirect('/login'); // not logged in, redirect to login page
};	



//================================
// Database
//================================

var database = require('./database/database');


//================================
// Index.js
//================================

app.get('/',index.root);


//================================
// Users.js
//================================



app.get('/login',users.login);
app.post('/login',users.postLog);
app.post('/register',users.regPost);
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

var server = app.listen(port,function(){
	console.log('Listening on port %d',port);
});