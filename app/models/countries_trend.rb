class CountriesTrend < ActiveRecord::Base
	belongs_to :country
	belongs_to :trend

	def self.process_data(data, trend_id, index)
		result = []
		interval = 2 # check trend every 2 hours
		time = Time.now #self.all.sort_by(&:time_of_trend)[-1][:time_of_trend]
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

			time -= cycle # set time 2 hours before
			interval += 2 # next interval
		end
		result
	end

	def self.heat_map(country, daily=false)
		time = Time.now #self.all.sort_by(&:time_of_trend)[-1][:time_of_trend]
		country_id = Country.find_by_name(country).nil? ? false : Country.find_by_name(country).id
		return false if !country_id  # return false if no country has been found 

		# fetch country trends from the last 24 hours ordered by creation
		data = self.where("country_id = ? AND time_of_trend >= ?", country_id, time - 86400).order('time_of_trend DESC')
		
		# verifying that trends exists (if not, destroy the joiner record)
		data.map! { |record| Trend.exists?(record.trend_id) ? record : record.destroy }.compact

		# OPTION I: current trends (get a uniq 10 result array of trends id's as most popular comes first)
		trends_ids = data.sort_by { |record| record.time_of_trend }.map { |record| record.trend_id }.compact.pop(10)

		# OPTION II: daily trends (get a uniq 10 result array of trend id's as most popular comes first)
		if daily
			trends_ids.map! do |trend_id|
				[ trend_id, self.where("trend_id = ?", trend_id).inject(0) { |sum, record| sum + record.rank } ]
			end
			trends_ids = trends_ids.sort_by { |trend| trend[1] }.shift(10).map { |trend| trend[0] }
		end

		# for every uniq trend fetch a matching set of data that match the heat map
		trends_ids.each_with_index.map { |id, index|
			self.process_data(data.map { |record| record if record.trend_id == id }.compact, id, index + 1)
		}.flatten
	end

end
