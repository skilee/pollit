var db;
exports.getDb = function(database){
	db = database;
}

exports.all = function(req,res){
	res.render('category');
}

exports.this = function(req,res){
	var category = req.param('catName').toLowerCase();
	// category = category.split('');
	// category[0] = category[0].toUpperCase();
	// category = category.join('');
	console.log('url : '+category);	
	db.collection('polls').find({category:category}).toArray(function(err,polls){
		if(!err){
			console.log(polls);
			res.render('thisCat',{polls:polls});
		}		
	});	
}

exports.create = function(req,res){

	res.render('categoryCreate');

}

exports.saveCategory = function(req,res){
	var categoryName = (req.body.cName).toLowerCase();
	var categoryDescription = req.body.cDescription;
	var categoryTags = (req.body.cTags).toLowerCase().split(',');
	var category = {
		name:categoryName,
		description:categoryDescription,
		tags:categoryTags
	}
	db.collection('category').insert(category,function(err,results){
		if(err){
			res.send(err);
		}else{
			res.redirect('/create');
		}
	});

}

exports.ajSearch = function(req,res){
	var categoryName = (req.query.categoryName).toLowerCase();	
	db.collection('category').find({$or:[{tags:categoryName},{name:categoryName}]}).toArray(function(err,categories){
		if(err){
			console.error(err);
		}else{
			res.send(categories);
		}
	});

}