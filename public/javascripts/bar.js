$(function(){
	var canvas=document.getElementById("myCanvas")
var ctx=canvas.getContext("2d");
var upVal=1;
var downVal=1;
var up=$('#up');
var down=$('#down');
up.html('yes '+upVal);
down.html('no '+downVal);
var widthRect1;
var widthRect2;

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
var widthFull=400;
});
