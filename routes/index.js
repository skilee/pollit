var db;
exports.getDb = function(database){
	db = database;
}

exports.root = function (req,res){
	var totalPolls;
	var limitValue = 3;
	db.collection('polls').find().count(function(err,count){
		totalPolls = count;
		if(req.session != null && req.session.user != null){
			db.collection('polls')
			.find()
			.sort({_id:-1})
			//.skip(0)
			.limit(limitValue)
			.toArray(function(err,items){
				items.count = totalPolls;	
				items.pageNo = 0;														
				res.render('home2',{items:items});
		
			});
		}
		else{			
			db.collection('polls')
			.find()
			.sort({_id:-1})
			//.skip(3)
			.limit(limitValue)
			.toArray(function(err,items){	
				items.count = totalPolls;
				items.pageNo = 0;					
				res.render('home',{items:items});
			});
		}
	});	

}

exports.page = function(req, res){
	var totalPolls;
	var pageNo = req.param('pageNo');	
	var limitValue = 3;
	var toSkip = pageNo*limitValue;	
	// if(!pageNo)
	// 	var pageNo = 0;	
	// if(!toSkip)
	// 	var toSkip = 0;
	if(pageNo>=0){
		db.collection('polls').find().count(function(err,count){
			totalPolls = count;
			if((pageNo*limitValue)+toSkip>=totalPolls){
				pageNo = 0;
			}
			if(req.session != null && req.session.user != null){			
				db.collection('polls')
				.find()
				.sort({_id:-1})
				.skip(toSkip)
				.limit(limitValue)
				.toArray(function(err,items){		
					items.count = totalPolls;		
					items.pageNo = parseInt(pageNo);					
					res.render('home2',{items:items});			
				});
			}
			else{				
				var pageNo = req.param('pageNo');
				db.collection('polls')
				.find()
				.sort({_id:-1})
				.skip(toSkip)
				.limit(limitValue)
				.toArray(function(err,items){		
					items.count = totalPolls;				
					items.pageNo = parseInt(pageNo);
					res.render('home',{items:items});
				});
			}
		});		
	}else{
		res.send('never go full retard! <br><br><a href="/">Take me back!</a>');
	}
	


}

exports.logout = function(req,res){    
	req.session.user = null;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    res.redirect('/');
}
