# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Load the app's custom environment variables here, before environments/*.rb
twitter_credentials = File.join(Rails.root, 'config', 'initializers', 'twitter_credentials.rb')
load(twitter_credentials) if File.exists?(twitter_credentials)

# Initialize the Rails application.
Twendy::Application.initialize!
