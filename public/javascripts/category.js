$(function(){
	if(top.location.pathname==='/createcategory'||top.location.pathname==='/createCategory'){
		$('#category').on('submit',function(event){

			var categoryName = $('#cName').val().length;
			var description = $('#cDescription').val().length;
			var tags = $('#cTags').val().length;
			console.log(categoryName);
			console.log(tags);
			console.log(description);
			var flag = 1;
			if(categoryName<3){
				$('#error').text('Category Name cannot be empty');
				flag = 0;
			}else{
				flag = 1;
			}
			if(description<3){
				$('#error').text('Description cannot be empty');
				flag = 0;
			}else{
				flag = 1;
			}
			if(tags<3){
				$('#error').text('Tags cannot be empty');
				flag = 0;
			}else{
				flag = 1;
			}
			if(!flag){
				event.preventDefault();
			}
		});
	}
});