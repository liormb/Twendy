class Country < ActiveRecord::Base
	has_many :countries_trends
	has_many :trends, through: :countries_trends

	before_create :set_trends_updated
	validates_uniqueness_of :name

	def set_trends_updated
		self.trends_updated = Time.now
	end
end
