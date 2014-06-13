$(function(){
	//var canvas=document.getElementById("myCanvas")
	//var ctx=canvas.getContext("2d");
	/*var upVal=1;
	var downVal=1;
	var up=$('#up');
	var down=$('#down');
	up.html('yes '+upVal);
	down.html('no '+downVal);
	var widthRect1;
	var widthRect2;
	var widthFull=400;
	var ratio;
	var total;
	up.on('click',function(){
		upVal+=1;
		up.html('yes '+upVal);
		ratio=upVal/downVal;
		rect();
	});
	down.on('click',function(){
		downVal+=1;
		down.html('no '+downVal);
		ratio=upVal/downVal;
		rect();
	});
	function rect(){
		total=upVal+downVal;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle="#555555";
		widthRect1=widthFull*(upVal/total);
		ctx.fillRect(0,0,widthRect1,25);
		widthRect2=widthFull*(downVal/total);
		ctx.fillStyle="#eeeeee";
		ctx.fillRect(widthRect1,0,widthFull,25)
		//ctx.fillRect(0,0,upVal*10,25);
	}
*/
	function Poll(id){
		this.id=id;
		this.up=$('#up_'+id);
		this.down=$('#down_'+id);
		this.upVal=1;
		this.downVal=0;
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
		var total=this.upVal+this.downVal;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle="#555555";
		var widthRect1=widthFull*(this.upVal/total);
		ctx.fillRect(0,0,widthRect1,25);
		var widthRect2=widthFull*(this.downVal/total);
		ctx.fillStyle="#eeeeee";
		ctx.fillRect(widthRect1,0,widthFull,25)
	}

	var widthFull=400;
	var polls=[];
	var li=$('#latest_container li');
	for(var i=0;i<li.length;i++){
		polls[i]=new Poll(i);
		polls[i].up.click(function(){
			var i=$(this).attr('id').split('_')[1]; 
			polls[i].upVote();
			polls[i].draw();
		});
		polls[i].down.click(function(){
			var i=$(this).attr('id').split('_')[1]; 
			polls[i].downVote();
			polls[i].draw();
		});
		polls[i].draw();

	}
	
});
