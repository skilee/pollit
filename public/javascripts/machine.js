/* INIT WORLD */

$(document).ready(function(){
	bind_once();
	tooltip_me();
});

$(window).load(function(){	
	var x = setTimeout(hideit,1000);
});

function tooltip_me(){
	$(".tip").tooltip({placement:"bottom"});
}

function bind_once(){
	$("#log").click(function(){
		$("#login_modal").modal();
	});
	$("#reg").click(function(){
		$("#reg_modal").modal();
	});
	$("#login_close").click(function(){
		$('#login_modal').modal('hide');
	});
	$("#reg_close").click(function(){
		$('#reg_modal').modal('hide');
	});
	$("#login_register").click(function(){
		$('#login_modal').modal('hide');
		$('#reg_modal').modal('show');
	});
}

function hideit(){
	$("#mask").fadeOut(1250,function(){
		document.getElementById("mask").style.zIndex="-10";
	});
}