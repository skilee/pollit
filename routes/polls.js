var db;
var bson;
exports.getBson = function(BSON){
	bson = BSON;
}
exports.getDb = function(database){
	db = database;
}

exports.root = function(req,res){
	var totalPolls;
	var limitValue = 3;
	db.collection('polls').find().count(function(err,count){
		totalPolls = count;
			db.collection('polls')
			.find()
			.sort({_id:-1})
			.limit(limitValue)
			.toArray(function(err,items){	
				items.count = totalPolls;
				items.pageNo = 0;					
				res.render('polls',{items:items});
			});
		});
}

exports.pagination = function(req,res){
	var totalPolls;
	var pageNo = req.param('pageNo');
	console.log('pageNo backend : '+pageNo);
	console.log(typeof pageNo);
	var limitValue = 3;
	var toSkip = pageNo*limitValue;	
	if(!pageNo)
		var pageNo = 0;	
	if(!toSkip)
		var toSkip = 0;
	if(pageNo>=0){
		db.collection('polls').find().count(function(err,count){
			totalPolls = count;
			if((pageNo*limitValue)+toSkip>totalPolls){

				pageNo = 0;
			}	
			db.collection('polls')
			.find()
			.sort({_id:-1})
			.skip(toSkip)
			.limit(limitValue)
			.toArray(function(err,items){		
				items.count = totalPolls;				
				items.pageNo = parseInt(pageNo);		
				res.render('polls',{items:items});
			});			
		});		
	}
	else{
		res.send('never go full retard!');
	}
	

}

exports.page = function(req,res){
	var id = req.param('id');
	db.collection('comments').find({pollId:id}).sort({_id:-1}).toArray(function(err,comments){
		db.collection('polls').findOne({_id:new bson.ObjectID(id)},function(err,doc){
			res.render('apoll',{doc:doc,comments:comments});
		});
	});
}

exports.create = function(req,res){
	res.render('create');
}

exports.postCreate = function(req,res){	
	req.body.votes = [];
	var number = req.body.optionNo;
	for(var i=0;i<=number;i++){
		req.body.votes.push(0);
	}	
	var category = req.body.category;
	if(category==''){
		req.body.category = "disjoint";
	}
	req.body.tags = req.body.tags.toLowerCase().split(',');
	if(req.body.tags.length==1){
		if(req.body.tags[0].length==0){
			req.body.tags = req.body.question.split(' ');
		}
	}
	var date = (new Date()).toJSON();
	var username = req.session.user;
	req.body.creator = username;
	req.body.createdOn = date;
	console.log(req.body);
	db.collection('polls').insert(req.body,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.redirect('/mypolls');
		}
	});
}

exports.vote = function(req,res){
	var optionNo = req.query.optionNo;  // which option_optionNo (eg: yes_1)
	var myPollsVoted = [];	 // to check if voted before or not
	var optionValue = req.query.option;	//yes or no...
	optionValue = optionValue.split(' ').join('_'); //remove spaces , more consistant
	var id = req.param('id');  // id of question
	id = new bson.ObjectID(id); // to bson 
	var user = req.session.user;
	var polls = {
		id:req.param('id'),
		option:optionValue
	}			
	db.collection('users').findOne({username:user},function(err,user){
		myPollsVoted = user.myPollsVoted;		
		var searchTerm = req.param('id');
		var index = -1;	
		if(typeof myPollsVoted!="undefined"){			
			for(var i = 0, len = myPollsVoted.length; i < len; i++) {							
			    if (myPollsVoted[i].id === searchTerm) {			    	
			        index = i;
			        break;
			    }
			}	
		}				
		if(typeof myPollsVoted==="undefined" || index==-1){
			var votes = [];
			db.collection('polls').findOne({_id:id},function(err,poll){
				poll.votes[optionNo]+=1;
				votes = poll.votes;				
				db.collection('polls').update({_id:id},{$set:{votes:votes}},function(err,result){
				if(!err){
					db.collection('users').update({username:req.session.user},{$push:{myPollsVoted:polls}},function(err,result){
							if(!err){
								res.send(' ');
							}
						});
					}else{
						console.error(err);
					}
				});
			});
		}else{
				res.send('');
			}
		});
	}
exports.comment = function(req,res){
	var id=req.param('id');
	var comment=req.query.comment;
	var commentObj={
		pollId:id,
		date:(new Date()).toLocaleDateString(),
		commentor:req.session.user,
		comment:comment
	}
	db.collection('comments').insert(commentObj,function(err,result){
		if(!err){
			res.send(result);	
		}else{
			res.send('');
		}
	});
}

