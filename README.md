# Twendy
By [Lior Elrom](http://liormb.com/).

####<http://twendy-app.herokuapp.com>

- - -

### Twendy is a visual application that presents global Twitter trends in the past 24 hours.

![Twendy](/app/assets/images/twendy.png "Twendy")

## Background

Twitter users send more than 95 million Tweets a day, on just about every topic imaginable. This is quite a lot to handle! In order to better understand what are the most popular topics people are tweeting about, Twitter decided to track the volume of terms mentioned by its users on an ongoing basis and turn them into topics. When the volume of tweets about a given topic dramatically increases at a given moment, a Trend is born!

Since Twitter Trends represent topics that are being talked about more right now than they were previously, we decided it would be a great idea to feel the world's pulse by building an application that will give a visual and easy access to those trends and track their popularity at any given time. 

We choose to serve this data on a globe, divided into countries, where clicking on a specific country will bring-up its 10 most recent trends and present how they were changing in the past 24 hours. Twitter currently tracks 63 countries but we plan on growing along when Twitter as it adds more countries to it's list.

## How to use Twendy?

Drag the globe to your desired country and click it! A pop-up window will come up with the country's 10 hottest trends and their rate of appearance in the past 24 hours. The trend's popularity is being represented by a heat-map table where the hottest trend has a red color and the least with blue.

When you want to return to the whole globe country, just click the last country you clicked before (as it marked with an orange color).

![Twendy](/app/assets/images/twendy-switzerland.png "Twendy")
###
## Technologies

* Ruby on Rails 4
* PostgreSQL
* Heroku Task Scheduler
* Javascript
* jQuery
* AJAX
* d3.js
* API's (Twitter, Yahoo WOEID and Geocoder)
* rspec

## Code and Stracture

Twendy is combind from 3 models:
* [Country](https://github.com/liormb/twendy/blob/master/app/models/country.rb): holding the country information including the timestamp of when its trends was last updated.
* [Trend](https://github.com/liormb/twendy/blob/master/app/models/trend.rb): holding each and every uniq trend information
* [CountriesTrend](https://github.com/liormb/twendy/blob/master/app/models/countries_trend.rb): using as a join table by assigning each trend to its country (or countries)

All the code, throughout the application, is well commented for readability and future debugging.
```ruby
def self.process_data(data, trend_id, index)
	result = []
	interval = 2 # check trend every 2 hours
	time = Time.now
	cycle = 60 * 60 * 2 # two hours cycle
	my_trend = Trend.find(trend_id)

	until interval > 24 do
		# get all trends for that time cycle
		trends = data.map {|record| record if record[:time_of_trend] <= time && record[:time_of_trend] > (time - cycle) }.compact

		# get all ranks for those trends
		ranks = trends.map {|trend| trend[:rank] }.compact
		ranks = [0,0] if ranks.empty?

		# calculate an avarage rank and round or floor the result
		# floor when last rank is better and round vise versa
		median = ranks.inject { |sum, rank| sum + rank }.to_f / ranks.length
		avarage_rank = (ranks.length == 1) ? median.floor : (ranks[0] < ranks[1]) ? median.floor : median.round

		# build the dataset that will match the heat map requirments
		result << { :"name" => my_trend.name, :"twitter_url" => my_trend.twitter_url, :"interval" => interval, :"trend" => index, :"rank" => avarage_rank }

		time -= cycle # set time as 2 hours before
		interval += 2 # next interval
	end
	result
end
```

And also scalable and devided to different templates

```ruby
<%= render "layouts/templates/globe" %>

<%= render "layouts/templates/drawer" %>

<%= render "layouts/templates/heatmap" %>
```

##Test Driven Development

I am a big fan of testing and strongly believe that every application should contain testing units in order to improve existing code and maintain a working application. As a result, Twendy is well tested on the server side with 100% covarage.
###
![TDD](/app/assets/images/coverage.png "TDD")
