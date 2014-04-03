# Twendy
By [Lior Elrom](http://liormb.com/).

####<http://twendy-app.herokuapp.com>

## Twendy is a visual application that presents global Twitter trends in the past 24 hours.

![Twendy](/app/assets/images/twendy-switzerland.png "Twendy")

## Background

Twitter users send more than 95 million Tweets a day, on just about every topic imaginable. This is quite a lot to handle! In order to better understand what are the most popular topics people are tweeting about, Twitter decided to track the volume of terms mentioned by its users on an ongoing basis and turn them into topics. When the volume of tweets about a given topic dramatically increases at a given moment, a Trend is born!

Since Twitter Trends represent topics that are being talked about more right now than they were previously, we decided it would be a great idea to feel the world's pulse by building an application that will give a visual and easy access to those trends and track their popularity at any given time. 

We choose to serve this data on a globe, divided into countries, where clicking on a specific country will bring-up its 10 most recent trends and present how they were changing in the past 24 hours. Twitter currently tracks 63 countries but we plan on growing along when Twitter as it adds more countries to it's list.

## How to use Twendy?

Drag the globe to your desired country and click it! A pop-up window will come up with the country's 10 hottest trends and their rate of appearance in the past 24 hours. The trend's popularity is being represented by a heat-map table where the hottest trend has a red color and the least with blue.

When you want to return to the whole globe country, just click the last country you clicked before (as it marked with an orange color).

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

##Test Driven Development

I am a big fan of testing and strongly believe that every application should contain testing units in order to improve existing code and maintain a working application. As a result, Twendy is well tested on the server side with 100% covarage.
![TDD](/app/assets/images/coverage.png "TDD")
