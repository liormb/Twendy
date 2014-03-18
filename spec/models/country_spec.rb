require 'spec_helper'

describe Country do
  describe "Given two countries name and woeid information" do
  	before do
  		@countries = [
  			{ name: "World1", woeid: 1 },
  			{ name: "World2", woeid: 2 }
  		]
  	end

  	describe "make new entries in the database" do
  		before do
  			@countries.each_with_index do |country, index|
	  			Country.create(country)
	  		end
  		end

  		it "check if two entries were created" do
  			Country.all.count.should == 2
  		end

			it "check if the countries store in the database includes a name and a woeid" do
	  		Country.all.each_with_index do |country, index|
	  			country.name.should == @countries[index][:name]
	  			country.woeid.should == @countries[index][:woeid]
	  		end
	  	end  		

  	end
  end
end
