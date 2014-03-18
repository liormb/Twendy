require 'spec_helper'

describe CountriesTrend do
  describe "Given a country and two trends in the database" do
		before do
			@country = Country.create({ name: "World", woeid: 1 })

			trends_array = [
				{ name: "#Trend1", twitter_url: "http://url1.com" },
				{ name: "#Trend2", twitter_url: "http://url2.com" }
			]
			@trends = trends_array.each_with_index.map do |trend, index|
				Trend.create(trend)
			end

			@trends.each_with_index do |trend, index|
				data = {
					trend_id: trend.id,
					country_id: @country.id,
					rank: index + 1,
					time_of_trend: Time.now
				}
				CountriesTrend.create(data)
			end
			@country.trends_updated = Time.now
			@country.save
		end

		describe "and trends are assosiate with that country" do
			it "check if two entries were created" do
  			CountriesTrend.all.count.should == 2
  		end

  		it "records includes valid trend id" do
	  		CountriesTrend.all.each do |record|
	  			Trend.where("id = ?", record.trend_id).empty?.should == false
	  		end
	  	end

	  	it "records includes valid country id" do
	  		CountriesTrend.all.each do |record|
	  			record.country_id.should == @country.id
	  			Country.where("id = ?", record.country_id).empty?.should == false
	  		end
	  	end

	  	it "creating rank in the same order the trends are" do
	  		CountriesTrend.all.each_with_index do |record, index|
	  			record.rank.should == index + 1
	  		end
	  	end

	  	it "creating time_of_trend field" do
	  		CountriesTrend.all.each do |record|
	  			record.time_of_trend.nil?.should == false
	  		end
	  	end

	  	it "check if created_at and updated_at fields are being creating with a new entry" do
	  		expect(CountriesTrend.new).to respond_to(:created_at, :updated_at)
	  	end 
		end

		describe "relationship between Country and Trend tables exists" do
			it "where a user can access all countries trends" do
				@country.trends.count.should == 2
			end

			it "where a user can access all trend's countries" do
				CountriesTrend.all.each do |record|
					Trend.find(record.trend_id).countries.empty?.should == false
				end
			end			
		end

		describe "retrieve the heat-map format data" do
			it "given a non-existing country name" do
				CountriesTrend.heat_map("non_existing_country_name").should == false
			end

			it "given an existing country name sould return an array" do
				CountriesTrend.heat_map(@country.name, true).instance_of?(Array).should == true
			end
		end
  end
end
