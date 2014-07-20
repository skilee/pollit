var db;
exports.getDb = function(database){
	db = database;
}

exports.root = function (req,res){
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
}
exports.logout = function(req,res){    
	req.session=null;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    res.redirect('/');   
}
