$(function(){
	function Poll(id,up,down){
		this.id=id;
		this.up=$('#up_'+id);
		this.down=$('#down_'+id);
		this.upVal=typeof up!=='undefined'?up:1;
		this.downVal=typeof down!=='undefined'?down:0;
		this.canvas=document.getElementById('myCanvas_'+id);
		this.ctx=this.canvas.getContext('2d');
}
	Poll.prototype.upVote=function(){
		this.upVal+=1;
	}
	Poll.prototype.downVote=function(){
		this.downVal+=1;
	}
	Poll.prototype.draw=function(){
		var ctx=this.ctx;
		var colorUp="#666666";
		var colorDown="#bbbbbb";
		ctx.strokeStyle="#000000";
		ctx.lineWidth=2;
		var total=this.upVal+this.downVal;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle=colorUp;
		var widthRect1=widthFull*(this.upVal/total);
		ctx.strokeRect(0,0,widthRect1,25);
		ctx.fillRect(0,0,widthRect1,25);
		var widthRect2=widthFull*(this.downVal/total);
		ctx.fillStyle=colorDown;
		ctx.strokeRect(widthRect1,0,widthFull,25)
		ctx.fillRect(widthRect1,0,widthFull,25)
	}

	var widthFull=400;
	var latest=function(){
		var polls=[];
		var li=$('#latest_container li');
		for(var i=0;i<li.length;i++){
			polls[i]=new Poll(i);
			polls[i].up.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].upVote();
				$('#upVal_'+i).text(polls[i].upVal);
				polls[i].draw();
			});
			polls[i].down.click(function(){
				var i=$(this).attr('id').split('_')[1]; 
				polls[i].downVote();
				$('#downVal_'+i).text(polls[i].downVal);
				polls[i].draw();
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
if(top.location.pathname==='/'){
	latest();
}

if(top.location.pathname==='/mypolls'){
	window.onLoad=mine();
}
});
