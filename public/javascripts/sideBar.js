$(function(){
	$.fn.followTo = function (pos) {
    var $this = this,
        $window = $(window);

    $window.scroll(function (e) {
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'fixed',
                top:'0px'                                 				
            });
        } else {
            $this.css({
                position: 'absolute',
                top: pos
            });
        }
    });
};
$('#sideBar').mouseenter(function(){
	$('#sideBar span').show(100);
}).mouseleave(function(){
	$('#sideBar span').hide();
	$('#sideSideBar').hide();
});
$('#category').mouseenter(function(){
	$('#sideSideBar').toggle(100);
});
$('#sideSideBar').hide();

$('#sideBar span').hide();

$('#sideBar').followTo(50);
});