# ================================
# Creates countries and adds woeid
# ================================

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
  config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
  config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
  config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
end

# get all countries names
countries = []
client.trends_available.each do |record|
	countries << record[:attrs][:country]
end

# make sure countries names uniq,
# sort by abc and place World as first variable
countries.uniq!.sort!
countries[0] = "World"

# creating the countries table with all names and woeid (Where On Earth IDentifier)
countries.each do |country|
	id = ENV['YAHOO_ID']
	url = "http://where.yahooapis.com/v1/places.q(#{country.gsub(" ","%20")})?appid=#{id}"
	response = HTTParty.get(url)
	woeid = response['places']['place']['woeid']
	Country.create({ name: country, woeid: woeid })
end
