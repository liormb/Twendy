
function Trend(name, trend, interval, rank) {
	this.name = name;
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
				// $.each(data, function(index, trend) {
				// 	var new_trend = new Trend(trend.name, trend.trend, trend.interval, trend.rank);
				// 	self.add(new_trend);
				// });
				// self.trends_list_view.render(self.trends);
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
		var $globus = $('canvas'),
        $chart  = $('#chart'),
        $ul = $('.trend-container ul');

		$chart.fadeTo(200,.1);
		$chart.empty();
		
		trendsD3([],trends);
		$chart.fadeTo(200, 1);
		
		var curr_trends = [];
		$.each(trends, function(index, trend) {
			if (trend.interval === 1) curr_trends.push(trend.name);
		});
		curr_trends = curr_trends.slice(-10,-1);

		$ul.empty();
		$.each(curr_trends, function(index, trend) {
			var $li = $('<li>').attr({'class': 'trend'}).text(trend);
			$ul.append($li);
		});
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
		// var self = this;
		// var $ul = $('ul#country-list');
		// $.each(this.collection.countries, function(index, country) {
		// 	var $li = $('<li>');
		// 	$li.attr({'id': 'country'}).text(country.name);
		// 	$ul.append($li);
		// });
		// self.addHandlers();
	}
	// addHandlers: function() {
	// 	var self = this;
	// 	$('.twitter-country').on('click', function(event) {
	// 		self.trends_list.fetch(this.textContent);
	// 	});
	// }
}

$(function() {
  new CountriesListView;
});
