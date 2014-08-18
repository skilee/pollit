
]	$(function(){
	function Poll(id,up,down){
		this.id = id;
		this.up = $('#up_'+id);
		this.down = $('#down_'+id);
		this.upVal = typeof up!=='undefined'?up:1;
		this.downVal = typeof down!=='undefined'?down:0;
		this.canvas = document.getElementById('myCanvas_'+id);
		this.ctx = this.canvas.getContext('2d');
}
	Poll.prototype.upVote=function(i){
		var id=this.up.data('id');
		id=id.substring(1,25);
		$.get('/up/'+id,function(data){
		if(data.length!=0){
				polls[i].upVal+=1;
				$('#upVal_'+i).text(polls[i].upVal);
				polls[i].draw();			
		}else{
			polls[i].up.remove();
			polls[i].down.remove();
			$('#sp_'+i).text('Already voted!');
		}
		});
	}
	Poll.prototype.downVote=function(i){
		var id=this.down.data('id');
		id=id.substring(1,25);
		$.get('/down/'+id,function(data){
		if(data.length!=0){
				polls[i].downVal+=1;
				$('#downVal_'+i).text(polls[i].downVal);
				polls[i].draw();			
		}else{

			polls[i].up.remove();
			polls[i].down.remove();
			$('#sp_'+i).text('Already voted!');
		}
		});
	}
	Poll.prototype.draw=function(){
		var ctx=this.ctx;
		var colorUp="#16193B";
		var colorDown="#ADD5F7";
		//ctx.strokeStyle="#000000";
		//ctx.lineWidth=2;
		var total=this.upVal+this.downVal;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle=colorUp;
		var widthRect1=widthFull*(this.upVal/total);
		//ctx.strokeRect(0,0,widthRect1,25);
		ctx.fillRect(0,0,widthRect1,25);
		var widthRect2=widthFull*(this.downVal/total);
		ctx.fillStyle=colorDown;
		//ctx.strokeRect(widthRect1,0,widthFull,25)
		ctx.fillRect(widthRect1,0,widthFull,25)
	}

	var polls=[];
	var widthFull=400;
	var latest=function(){
		var li=$('#latest_container li');
		for(var i=0;i<li.length;i++){
			var up = parseInt($('#upVal_'+i).text());
			var down = parseInt($('#downVal_'+i).text());
			polls[i]=new Poll(i,up,down);
			polls[i].up.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].upVote(i);
				$(this).remove();
				polls[i].down.remove();
			});
			polls[i].down.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].downVote(i);
				$(this).remove();
				polls[i].up.remove();
			});
			polls[i].draw();

		}
	}
	var all=function(){
		var li=$('#polls_container li');
		for(var i=0;i<li.length;i++){
			var up=parseInt($('#upVal_'+i).text());
			var down=parseInt($('#downVal_'+i).text());
			polls[i]=new Poll(i,up,down);
			polls[i].up.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].upVote(i);
				$(this).remove();
				polls[i].down.remove();
			});
			polls[i].down.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].downVote(i);
				$(this).remove();
				polls[i].up.remove();
			});
			polls[i].draw();

		}
	}
	var mine=function(){
		var polls=[];
		var li=$('#my_container li');
		for(var i=0;i<li.length;i++){
			var up=parseInt($('#upVal_'+i).text());
			var down=parseInt($('#downVal_'+i).text());
			polls[i]=new Poll(i,up,down);
			polls[i].draw();
	}
}

	var poll;
	var apoll=function(){
		var up=parseInt($('#upVal_0').text());
		var down=parseInt($('#downVal_0').text());
		poll=new Poll(0,up,down);
		poll.draw();
		polls[0]=poll;
		poll.up.click(function(){ 
			poll.upVote(0);
			$(this).remove();
			poll.down.remove();
			});
		poll.down.click(function(){
			poll.downVote(0);
			$(this).remove();
			poll.up.remove();
			});
	}

var last=top.location.pathname.split('/');
var patt=new RegExp("\/polls/"+last[last.length-1]);
if(patt.test(top.location.pathname)){
	apoll();
}
if(top.location.pathname==='/'){
	window.onload=latest();
}

if(top.location.pathname==='/mypolls'){
	window.onLoad=mine();
}
if(top.location.pathname==='/polls'){
	window.onLoad=all();
}
});
