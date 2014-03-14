
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
	fetch: function(country) {
		var self = this;
		$.ajax({
			method: "get",
			url: "/countries/id",
			dataType: "json",
			data: { name: country },
			success: function(data) {
				$.each(data, function(index, trend) {
					var new_trend = new Trend(trend.name, trend.twitter_url, trend.trend, trend.interval, trend.rank);
					self.add(new_trend);
				});
				self.trends_list_view.render(self.trends);
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
	render: function(trends) {
		var $countries = $('.countries-list');
    var $chart  = $('.chart-container');
    $countries.empty();
		$chart.empty();
		heatMap([],trends);
		for (var i=0; i < trends.length; i += 12) {
			var name = trends[i].name.replace("#", "").substr(0, 22);
			$countries.append("<li><span>#</span>" + name + "</li>");
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
	//this.trends_list = new TrendsList;

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

$(function() {
  new CountriesListView;
});
