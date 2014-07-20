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
if(top.location.pathname==='/register'){
	$()
	var pass;
	var con_pass;
	var flag=0;
	$('#user').on('input',function(){
		user=$('#user').val();
		var parameter={username:user};
		var userAj=$.get('/usercheck',parameter,function(data){
			if(data.length==0){
				$('#userEx').text('Username Available').show().fadeOut( 1000 );
				flag=0;
			}
			else{
				$('#userEx').text('Username already taken :(').show();
					flag=1;
			}
		});
	});
	$('#pass').on('input',function(){
		pass=$('#pass').val();
		if(con_pass===pass){
			$('#passErr').text('Passwords do not match!').show().fadeOut( 1000 );

		}
	});
	$('#con_pass').on('input',function(){
		con_pass=$('#con_pass').val();
		if(con_pass!=pass){			
			$('#passErr').text('Passwords do not match!').show();
		}
		else{			
			$('#passErr').text('Passwords do not match!').show().fadeOut( 1000 );
		}
	});
	
	$('#reg').submit(function(e){
		if(flag!=0){
			e.preventDefault();
			$('#userEx').text('Change that username, its already taken').show();
		}
		if(con_pass!=pass){
			e.preventDefault();
			$('#passErr').text('Passwords do not match!').show();
		}
	});
	
}
	//======================
	//		EDIT	
	//======================
	if(top.location.pathname==='/edit'){
		$.get('/ajedit',function(data){
			$('#user').val(data.username);
			$('#email').val(data.email);

	});
}

		
	//======================
	//		SEARCH	
	//======================

	$('#search2').on('keyup',function(e){
		

     var parameters = { search: $(this).val() };
     if(e.keyCode===13){
     var getAj=  $.get( '/search',parameters, function(data) {
       		if(data.length===0){
       			$('#results').html('Not found').show().fadeOut(4000);
       			console.log('asdasd');
       			getAj.abort();
       		}
       		else{
       			data.forEach(function(item){
       			var res1='<a href=/polls/'+item._id+'> <h3>'+item.question+"</h3></a>";
		  		$('#results').html(res1).show();
       			});
		}
       		
  	});
	}
   });


	//======================
	//		Comments	
	//======================

	$('#comm_sub').click(function(){
		var parameters={comment:$('#comment').val()};
		console.log(parameters.comment);
		var id=$('#up_0').data('id').substring(1,25);
		var getAj=$.get('/comment/'+id,parameters,function(data){
			if(data.length!=0){
				$('#comm_list').prepend("<li id='comm'><h3>"+parameters.comment+"</h3><hr><h4>"+data[0].commentor+"</h4><h5>"+data[0].date+"</h5>")
			}
		});
		$('#comment').val('');
	});

});