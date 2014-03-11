# ================================
# Creates countries and adds woeid
# ================================

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
  config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
  config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
  config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
end

# get all country's names
countries = []
client.trends_available.each do |record|
	countries << record[:attrs][:country]
end

countries.uniq!.sort!

