$(function(){
	if(top.location.pathname==='/create'){
		var i=2;
		$('#addMore').click(function(e){
			e.preventDefault();
			var input = "<input class='form-control mar' type='text' placeholder='option "+i+"'name=option_"+i+">";
			$(this).before(input);
			console.log($('#hidd').attr("value",i).val());
			i+=1;
		});
	}
});