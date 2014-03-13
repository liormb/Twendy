
function heatMap(country) {
	// var trends_list = new TrendsList;
	// trends_list.fetch(country);
}

function eventHandler() {
	$('#close-heatmap-button').on('click', function(event){
		$('.heatmap-container').fadeOut(300);
	});
}

$(function() {
	eventHandler();
});
