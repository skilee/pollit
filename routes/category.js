var db;
exports.getDb = function(database){
	db = database;
}

exports.all = function(req,res){

	res.render('category');

}