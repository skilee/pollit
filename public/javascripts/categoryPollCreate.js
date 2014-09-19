$(function(){
	if(top.location.pathname==='/create'){
		$('#categorySearch').on('input',function(e){
			var categoryName = $(this).val();
			if(categoryName!='') {
				$.get('/catSearch',{categoryName:categoryName},function(data){
					var dataLength = data.length;
					console.log(dataLength);
					if(dataLength>0){						
						$('#categorySelect').html("<a>"+data[0].name+"</a>");
						$('#categorySelect a').click(function(){							
							$(this).html("<button type='button' name='categoryFind'>"+$(this).html()+"</button>");
							$('#categorySearch').val($(this).text());
							$(this).off('click');
						});
					}else{
						$('#categorySelect').html('');
					}
				});
			}
		});
	}

});