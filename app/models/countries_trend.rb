class CountriesTrend < ActiveRecord::Base
	belongs_to :country
	belongs_to :trend
end
