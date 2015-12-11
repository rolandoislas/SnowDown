!function(){
function addEvents() {
	$(document).on("click", ".logo", showAbout);
	$(document).on("click", ".selectionContainer", hideAbout);
	$(document).on("click", ".splashContainer", hideAbout);
}

function hideAbout() {
	$(".about").hide();
}

function showAbout() {
	$(".about").show();
}
	
$(document).ready(function() {
	addEvents();
});
}();