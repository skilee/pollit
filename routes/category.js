var db;
exports.getDb = function(database){
	db = database;
}

exports.all = function(req,res){
	res.render('category');
}

exports.this = function(req,res){
	var category = req.param('catName');
	category = category.split('');
	category[0] = category[0].toUpperCase();
	category = category.join('');
	console.log('url : '+category);	
	db.collection('polls').find({category:category}).toArray(function(err,polls){
		if(!err){
			console.log(polls);
			res.render('thisCat',{polls:polls});
		}		
	});	
}