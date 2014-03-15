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
    def update_trend(trend)
      # if trend exist: update the updated_at field and return it else return nil
      target = Trend.find_by_name(trend[:name])
      target.nil? ? (return nil) : target.touch
      return target
    end

    def get_trends(woeid)
      # trends comes in order as most popular comes first
      trends = @client.trends(woeid) 
      trends.attrs[:trends].map do |trend|
        update_trend(trend) || Trend.create({ name: trend[:name][0...255], twitter_url: trend[:url] })
      end
    end

    # heroku request limit is set to fetch 7 countries records every 10 min.
    # That is set in order to meet with the Twitter request limits (15 calls every 15 min)
    countries = Country.order(trends_updated: :asc).shift(7)
    countries.each do |country|
      trends = get_trends(country.woeid)
      if trends
        trends.each_with_index do |trend, index|
          data = { country_id: country.id, trend_id: trend.id, rank: index + 1, time_of_trend: Time.now }
          CountriesTrend.create(data)
        end
      end
      country.trends_updated = Time.now
      country.save!
    end

    Rake::Task["db:clear_old_trends"].execute
  end

  desc "Clear objects that older than 24 hour cycle"
  task clear_old_trends: :environment do
    cycle = 86400 # day in seconds
    Trend.where("updated_at < ?", Time.now - cycle).delete_all
    CountriesTrend.where("time_of_trend < ?", Time.now - cycle).delete_all
  end

  desc "Clear Countries table"
  task clear_countries: :environment do
    Country.delete_all
  end

  desc "Clear Trends table"
  task clear_trends: :environment do
    Trend.delete_all
  end

  desc "Clear CountriesTrend joiner table"
  task clear_countriestrend: :environment do
    CountriesTrend.delete_all
  end

  desc "Clear all tables"
  task clear_all: :environment do
    Country.delete_all
    Trend.delete_all
    CountriesTrend.delete_all
  end

end
