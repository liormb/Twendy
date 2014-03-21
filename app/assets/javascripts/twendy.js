
function Trend(name, twitter_url, trend, interval, rank) {
	this.name = name;
	this.twitter_url = twitter_url;
	this.trend = trend;
	this.interval = interval;
	this.rank = rank;
}

function TrendsList() {
	this.trends = [];
	this.trends_list_view = new TrendsListView;	
}
TrendsList.prototype = {
	add: function(trend) {
		this.trends.push(trend);
	},
	fetch: function(country, heatMapState) {
		var self = this;
		$.ajax({
			method: "get",
			url: "/countries/id",
			dataType: "json",
			data: { name: country, state: heatMapState },
			success: function(data) {
				$.each(data, function(index, trend) {
					var new_trend = new Trend(trend.name, trend.twitter_url, trend.trend, trend.interval, trend.rank);
					self.add(new_trend);
				});
				self.trends_list_view.render(self.trends, country);
			},
			error: function(data) {
				console.log("Failed to connect the database.");
			}
		});
	}
}

function TrendsListView(){
	var self = this;
}

TrendsListView.prototype = { 
	render: function(trends, country) {
		var $header = $('.heatmap-container h1').empty();
		var $trendsList = $('.trends-list').empty();
    var $chart  = $('.chart-container').empty();
    $header.text(country);
		heatMap([],trends);
		for (var i=0; i < trends.length; i += 12) {
			var name = trends[i].name.replace("#", "").substr(0, 22);
			var url = trends[i].twitter_url;
			$trendsList.append("<li><a href='" + url + "' target='_blank'><span>#</span>" + name + "</a></li>");
		}
		for (var i=0; i < countriesCodes.length; i++){ 
			if (countriesCodes[i]['name'] == country) {
				var baseURL = "http://www.geonames.org/flags/x/";
				$('.heatmap-bg').attr('src', baseURL + countriesCodes[i]['code'].toLowerCase() + ".gif");
				break;
			}
		}
		$('.heatmap-container').fadeIn(300);
	}
}

function Country(name, woeid, trends_updated) {
	this.name = name;
	this.woeid = woeid;
	this.trends_updated = trends_updated;
}

function CountriesList() {
	this.countries = [];
}
CountriesList.prototype = {
	add: function(country) {
		this.countries.push(country);
	},
	fetch: function(success) {
		var self = this;
		$.ajax({
			method: "get",
			url: "/countries",
			dataType: "json",
			success: function(data) {
				$.each(data, function(index, country) {
					var new_country = new Country(country.name, country.woeid, country.trends_updated);
					self.add(new_country)
				});
				success();
			},
			error: function(data) {
				console.log("Failed to connect to the database.");
			}
		});
	},
	names: function() {
		var countries = [];
		$.each(this.countries, function(index, country){
			countries.push(country.name);
		});
		return countries;
	}
}

function CountriesListView(){
	this.collection = new CountriesList;
	
	// bypassing lexical scope to seperate concerns
	var self = this;
	var success = function() {
		self.render();
	};
	this.collection.fetch(success);
}

CountriesListView.prototype = { 
	render: function() {
		drawGlobe(this.collection.names());
	}
}

function eventHandler() {
	$('button.slide-right-drawer').on('click', function(event){
		var right = ($('.right-drawer-container').css('right') >= '0px') ? '-265px' : '0';
		$('.right-drawer-container').animate({right: right}, 500);
	});
	$('button.close-heatmap').on('click', function(event){
		$('.heatmap-container').fadeOut(300);
	});
	$('label.timeline-slider').on('click', function(event){
		eventTriger++;
		if (eventTriger == 2) {
			heatMapState = (heatMapState == "now") ? "daily" : "now";
			var trends_list = new TrendsList;
			trends_list.fetch(currentCountry, heatMapState);
			eventTriger = 0;
		}
	});
}

// global variables
var currentCountry;
var heatMapState = "now";
var eventTriger = 0;

$(function() {
	eventHandler();
  new CountriesListView;
});
