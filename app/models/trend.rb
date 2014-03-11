class Trend < ActiveRecord::Base
	has_many :countries_trends
	has_many :countries, through: :countries_trends

	validates_uniqueness_of :name
end
