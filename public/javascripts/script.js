$(document).ready(function(){
	//======================
	//		Ajax image
	//======================
var $loading = $('#aj').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

	//======================
	//		Register
	//======================
	/***********var pass;
	var con_pass;
	$('#pass').on('input',function(){
		pass=$('#pass').val();
		if(con_pass===pass){
			$('span').text('Passwords do not match!').show().fadeOut( 1000 );

		}
	});
	$('#con_pass').on('input',function(){
		con_pass=$('#con_pass').val();
		if(con_pass!=pass){			
			$('span').text('Passwords do not match!').show();
		}
		else{			
			$('span').text('Passwords do not match!').show().fadeOut( 1000 );
		}
	});
	
	$('#reg').submit(function(e){
		if(con_pass!=pass){
			e.preventDefault();
			$('span').text('Passwords do not match!').show();
		}
	});
**********/

	//======================
	//		EDIT	
	//======================

	$.get('/ajedit',function(data){
		$('#user').val(data.username);
		$('#email').val(data.email);
	});

	//======================
	//		SEARCH	
	//======================

	$('#search').on('keyup',function(e){
		

     var parameters = { search: $(this).val() };
     if(e.keyCode===13){
     var getAj=  $.get( '/search',parameters, function(data) {
       		if(data.length===0){
       			$('#results').html('Not found').fadeOut(4000);
       			getAj.abort();
       		}
       		else{
       			var res1='<h3>'+data.question+"</h3>";
		  		$('#results').html(res1).show();
		}
       		
  	});
	}
   });
});