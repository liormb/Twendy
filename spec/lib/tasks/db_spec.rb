# require 'spec_helper'
# require 'rake'

# describe "db rake tasks" do
#   before do
#     @rake = Rake::Application.new
#     Rake.application = @rake
#     load "tasks/db.rake"
#     Rake::Task.define_task(:environment)
#   end

#   describe "rake task db:auth" do
#   	before do
#   		@task_name = "db:auth"
#   	end

#   	it "authenticate Twitter credentials" do
#   		@rake[@task_name].invoke
#   	end
#   end

#   describe "rake task db:trends" do
#     before do
#       @task_name = "db:trends"
#     end

#     it "Seed the trends table" do
#       #@rake[@task_name].invoke
#     end
#   end

#   describe "rake task db:clear_countries" do
#     before do
#       @task_name = "db:clear_countries"
#     end

#     it "clear Countries table" do
#       @rake[@task_name].invoke
#     end
#   end

#   describe "rake task db:clear_trends" do
#     before do
#       @task_name = "db:clear_trends"
#     end

#     it "clear Trends table" do
#       @rake[@task_name].invoke
#     end
#   end

#   describe "rake task db:clear_countriestrend" do
#     before do
#       @task_name = "db:clear_countriestrend"
#     end

#     it "clear CountriesTrend table" do
#       @rake[@task_name].invoke
#     end
#   end

#   describe "rake task db:clear_all" do
#     before do
#       @task_name = "db:clear_all"
#     end

#     it "clear all tables" do
#       @rake[@task_name].invoke
#     end
#   end

# end
