class Country < ActiveRecord::Base
	has_many :countries_trends
	has_many :trends, through: :countries_trends

	validates_uniqueness_of :name
	before_create :set_trends_time_updated_to_now
end
