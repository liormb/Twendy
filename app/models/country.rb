class Country < ActiveRecord::Base
	has_many :countries_trends
	has_many :trends, through: :countries_trends

	before_create :set_trends_time_updated_to_now
	validates_uniqueness_of :name

	def set_trends_time_updated_to_now
		self.trends_updated = Time.now
	end
end
