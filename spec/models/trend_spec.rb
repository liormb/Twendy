require 'spec_helper'

describe Trend do
  describe "Given two trends name and twitter_url information" do
  	before do
  		@trends = [
  			{ name: "#Trend1", twitter_url: "http://www.myurl1.com" },
  			{ name: "#Trend2", twitter_url: "http://www.myurl2.com" }
  		]
  	end

  	describe "make new entries in the database" do
  		before do
  			@trends.each_with_index do |trend, index|
	  			Trend.create(trend)
	  		end
  		end

  		it "check if two entries were created" do
  			Trend.all.count.should == 2
  		end

			it "check if the trends store in the database includes a name and a twitter_url" do
	  		Trend.all.each_with_index do |trend, index|
	  			trend.name.should == @trends[index][:name]
	  			trend.twitter_url.should == @trends[index][:twitter_url]
	  		end
	  	end

	  	it "check if created_at and updated_at fields are being creating with a new entry" do
	  		expect(Trend.new).to respond_to(:created_at, :updated_at)
	  	end 		
  	end

    describe "check name's uniqueness" do
      before do
        Trend.create(@trends[0])
      end

      it "by adding another trend with the same name" do
        data = { name: "#Trend1", twitter_url: "http://www.myurl3.com" }
        trend = Trend.create(data)
        expect(trend[:id]).to eq(nil) 
      end
    end
  end
end
