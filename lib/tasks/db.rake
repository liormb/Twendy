namespace :db do

  desc "Authenticate Twitter credentials"
  task auth: :environment do
    @client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
      config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
    end
  end

  desc "Seed the trends table"
  task trends: [:auth] do
    def get_trends(woeid)
      # trends comes in order as most popular comes first
      trends = @client.trends(woeid) 
      trends.attrs[:trends].map do |trend|
        Trend.find_by_name(trend[:name]) || Trend.create({ name: trend[:name][0...255], twitter_url: trend[:url] })
      end
    end

    # heroku request limit is set to fetch 7 countries records every 15 min.
    # That is set in order to meet with the Twitter request limits
    countries = Country.order(trends_updated: :asc).shift(7)
    countries.each do |country|
      trends = get_trends(country.woeid)
      if trends
        trends.each_with_index do |trend, index|
          data = { country_id: country.id, trend_id: trend.id, rank: index + 1, time_of_trend: Time.now }
          country_trends = CountriesTrend.where(country_id: country.id) || []
          if country_trends.length < 10
            CountriesTrend.create(data) # create new object
          else
            id = country_trends.order(time_of_trend: :asc).first.id
            CountriesTrend.update(id, data) # update the older one
          end
        end
        country.trends_updated = Time.now
        country.save!
      end
    end
  end

  desc "Clear countries table"
  task clear_countries: :environment do
    Country.delete_all
  end

  desc "Clear trends table"
  task clear_trends: :environment do
    Trend.delete_all
  end

  desc "Clear all tables"
  task clear_all: :environment do
    Country.delete_all
    Trend.delete_all
  end

end
