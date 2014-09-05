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
	//		Login Send
	//======================

	$('#login_submit').click(function(){
		var username = $('#username').val();
		var password = $('#password').val();
		var login={username:username,password:password};
		$.post('/login',login,function(data){
			if(data==='yes'){				
				window.location.href = "/profile";
			}else{				
				window.location.href = "/"
			}
		});

	});


	//======================
	//		Register Send
	//======================

	$('#reg_submit').click(function(){
	// 	var pass;
	// 	var con_pass;
	// 	var flag = 0;
	// 	var flag2 = 0;
	// 	var flag3 = 0;
	// 	var passLength;
	// 	$('#user').on('input',function(){
	// 		user = $('#user').val();
	// 		var parameter = {username:user};
	// 		var userAj = $.get('/usercheck',parameter,function(data){
	// 			if(data.length==0){
	// 				$('#userEx').text('Username Available').show();
	// 				flag = 0;
	// 			}
	// 			else{
	// 				$('#userEx').text('Username already taken').show();
	// 					flag=1;
	// 			}
	// 		});
	// 	});
	// 	$('#pass').on('input',function(){
	// 		pass=$('#pass').val();
	// 		passLength = pass.length;		
	// 		if(passLength<8){
	// 			$('#passLen').text('Password length > 8').show();			
	// 			flag2 = 1;
	// 		}else{
	// 			$('#passLen').hide();
	// 			flag2 = 0;
	// 		}
				
	// 	});
	// 	$('#con_pass').on('input',function(){
	// 		con_pass=$('#con_pass').val();
	// 		if(con_pass!=pass){			
	// 			$('#passErr').text('Passwords do not match!').show();
	// 			flag3 = 1;
	// 		}
	// 		else{			
	// 			$('#passErr').hide();
	// 			flag3 = 0;
	// 		}
	// 	});
		
	// 	$('#reg').submit(function(e){
	// 		if(flag!=0&&flag2!=0&&flag3!=0){
	// 			e.preventDefault();
	// 			if(flag!=0){
	// 				$('#userEx').text('Change that username, its already taken').show();
	// 			}
	// 			if(flag2!=0){
	// 				$('#passLen').text('Password length > 8').show();
	// 			}
	// 			if(flag3!=0){
	// 				$('#passErr').text('Passwords do not match!').show();	
	// 			}
					
	// 		}
	// 		if(con_pass!=pass){
	// 			e.preventDefault();
	// 			$('#passErr').text('Passwords do not match!').show();
	// 		}
	// 	});
		var username = $('#regUsername').val();
		var password = $('#regPassword').val();
		var conPassword = $('#regConPassword').val();
		var email = $('#email').val();
		var register = {username:username,password:password,conPassword:conPassword,email:email};
		$.post('/register',register,function(data){
			if(data==='yes'){				
				window.location.href = "/profile";
			}else{				
				window.location.href = "/"
			}
		});

	});

	
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