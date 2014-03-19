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

      it "where the trends_updated field will be updated with the current time" do
        Country.all.each do |country|
          expect(country[:trends_updated]).not_to eq(nil) 
        end
      end

      it "update the trends_updated field with the current time" do
        country = Country.find_by_name(@countries[0][:name])
        trends_updated = country[:trends_updated]
        sleep(1)
        country.set_trends_updated
        country[:trends_updated].should_not eq(trends_updated)
      end 		
  	end

    describe "check name's uniqueness" do
      before do
        Country.create(@countries[0])
      end

      it "by adding another country with the same name" do
        data = { name: "World1", woeid: 3 }
        country = Country.create(data)
        expect(country[:id]).to eq(nil) 
      end
    end
  end
end
