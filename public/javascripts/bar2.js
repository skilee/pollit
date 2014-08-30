$(function(){
function Poll(pollNo, pollOptions,id,myVotes){
	this.pollNo = pollNo;
	this.pollOptions = [];
	this.upVoteVal = [];
	this.id = id.substring(1,25);		
	for(var i = 0;i<pollOptions.length;i++){		
		this.pollOptions[i] = pollOptions[i];					
		this.upVoteVal[i] = parseInt(myVotes[i].html());		
		
	}
	this.canvas = document.getElementById('myCanvas_'+pollNo);	
	this.ctx = this.canvas.getContext('2d');
}	
	Poll.prototype.vote = function(i,j){		
		 var id = this.id;		 
		 var option = this.pollOptions[j].html();
		$.get('/vote/'+id,{option:option,optionNo:j},function(data){
		if(data.length!=0){
				polls[i].upVoteVal[j]+=1;				
				$('.'+i+'_'+j).text(polls[i].upVoteVal[j]);
				polls[i].draw();
		}	
		else{									
			$('#sp_'+i).text('Already voted!');									
		}
		});
	}
	var widthFull = 600;
	Poll.prototype.draw = function(){
		var ctx = this.ctx;
		var colorUp = [];
		if(patt.test(top.location.pathname)){
			for(var i = 0;i<this.pollOptions.length;i++){
				colorUp[i] = '#fff';
			}
		}else{
			for(var i = 0;i<this.pollOptions.length;i++){
				colorUp[i] = '#FA'+(i+1)+'E'+(i+1)+'9';
			}
		}
		var total = 0;
		for(var i = 0,n = this.pollOptions.length;i<n;i++){
			total += this.upVoteVal[i];

		}			
		var widthRect = [];
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i = 0;i<this.pollOptions.length;i++){
			ctx.fillStyle = colorUp[i];
			widthRect[i] = widthFull*(this.upVoteVal[i]/total);
			ctx.fillRect(0,i*30,widthRect[i],25);
			ctx.fillStyle = "#000";
			ctx.font = "20px Arial";
			ctx.fillText(this.upVoteVal[i],10, i*30+20);
	}	
}	

	var polls = [];

	var home = function(){
		var li = $('#poll li');		
		for(var i = 0,n = li.length; i < n; i++){
			if(i<li.length){
				var options = $('.'+i+'_options');			
				var id = $('#title_'+i).data('id');									
				var myPollOptions = [];	
				var myVotes = [];	
				for(var j=0;j<options.children().length;j++){
					var option = $('#'+i+'_'+j);
					var vote = $('.'+i+'_'+j);			
					myPollOptions.push(option);
					myVotes.push(vote);
				}
				polls[i] = new Poll(i,myPollOptions,id,myVotes);						
				for(var k = 0,n = polls[i].pollOptions.length;k<n;k++){							
					polls[i].pollOptions[k].click(function(){
						var arr = $(this).attr('id').split('_');
						var i = arr[0];//poll					
						var j = arr[1];//option of poll
						polls[i].vote(i,j);						
						this.disabled = true;									
					});
				}
				polls[i].draw();
			}
		}	
	}

	var all = function(){
		var li = $('#poll li');		
		for(var i = 0,n = li.length; i < n; i++){
			if(i<li.length){
			
				var options = $('.'+i+'_options');			
				var id = $('#title_'+i).data('id');									
				var myPollOptions = [];	
				var myVotes = [];	
				for(var j=0;j<options.children().length;j++){
					var option = $('#'+i+'_'+j);
					var vote = $('.'+i+'_'+j);			
					myPollOptions.push(option);
					myVotes.push(vote);
				}			
				polls[i] = new Poll(i,myPollOptions,id,myVotes);						
				for(var k = 0,n = polls[i].pollOptions.length;k<n;k++){							
					polls[i].pollOptions[k].click(function(){
						var arr = $(this).attr('id').split('_');
						var i = arr[0];//poll					
						var j = arr[1];//option of poll
						polls[i].vote(i,j);						
						this.disabled = true;									
					});
				}
				polls[i].draw();	
			}
			
		}	

	}

	var mine = function(){
		var li = $('#poll li');				
		for(var i = 0,n = li.length; i < n; i++){			
			if(i<li.length){
				console.log(li.length);
				var options = $('.'+i+'_options');		
				var id = $('#title_'+i).data('id');									
				var myPollOptions = [];	
				var myVotes = [];	
				for(var j=0;j<options.children().length;j++){
					var option = $('#'+i+'_'+j);
					var vote = $('.'+i+'_'+j);			
					myPollOptions.push(option);
					myVotes.push(vote);
				}			
				polls[i] = new Poll(i,myPollOptions,id,myVotes);						
				for(var k = 0,n = polls[i].pollOptions.length;k<n;k++){							
					polls[i].pollOptions[k].click(function(){
						var arr = $(this).attr('id').split('_');
						var i = arr[0];//poll					
						var j = arr[1];//option of poll
						polls[i].vote(i,j);						
						this.disabled = true;									
					});
				}
				polls[i].draw();	
			}
			
		}	


	}
	var apoll = function(){
		var div = $('#polls_container');							
				var id = $('#title_0').data('id');
				var options = $('.0_options');									
				var myPollOptions = [];	
				var myVotes = [];
				for(var j=0;j<options.children().length;j++){
				 	var option = $('#0_'+j);
				 	var vote = $('.0_'+j);	
				 	myPollOptions.push(option);
				 	myVotes.push(vote);
				 }			
				 	polls[0] = new Poll(0,myPollOptions,id,myVotes);						
				 for(var k = 0,n = polls[0].pollOptions.length;k<n;k++){							
				 	polls[0].pollOptions[k].click(function(){
						var arr = $(this).attr('id').split('_');
						var i = 0;//poll					
						var j = arr[1];//option of poll
						polls[i].vote(i,j);						
						this.disabled = true;									
					});
				}
				polls[0].draw();			
	}	

	//Each Poll Page
	
	var last = top.location.pathname.split('/');
	var patt = new RegExp("\/polls/"+last[last.length-1]);
	if(patt.test(top.location.pathname)){
		apoll();
	}
	//Home page
	
	if(top.location.pathname === '/'){
		window.onload = home();
	}
	//My polls page
	
	if(top.location.pathname === '/mypolls'){
		window.onLoad = mine();
	}
	//All Polls
	
	if(top.location.pathname === '/polls'){
		window.onLoad = all();
	}
	var last2 = top.location.pathname.split('/');
	last2 = last2[last2.length-1];
	if(top.location.pathname === '/page/'+last2){
		window.onLoad = home();
	}
});	