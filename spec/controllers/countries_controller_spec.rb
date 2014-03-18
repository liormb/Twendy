require 'spec_helper'

describe CountriesController do
	describe "given one country, two associated trends and one joiner record" do
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

		describe "routing to the home page" do
			it "routes to the index page" do
		    expect(:get => "/").to route_to(
		      :controller => "countries",
		      :action => "index",
		    )
		  end
		end

		describe "visiting the index page" do
			before do
				get :index, :format => :json
			end

			it "responds successfully with an HTTP 200 status code" do
				expect(response).to be_success
      	expect(response.status).to eq(200)
			end

			it "returning response should be in json format" do
				response.header['Content-Type'].should include 'application/json'
			end

			it "loads all of the countries into @countries" do
	      expect(assigns(:countries)).to match_array([@country])
	    end

			it "return all countries" do
				response.body == Country.all.to_json
			end
		end

		describe "visiting the show page" do
			before do
				get :show, id: 0, name: @country[:name], :format => :json
			end

			it "returning response should be in json format" do
				response.header['Content-Type'].should include 'application/json'
			end

			it "returning the heat-map data for a specific country" do
				response.body.should == CountriesTrend.heat_map(@country[:name]).to_json
			end
		end
	end
end
