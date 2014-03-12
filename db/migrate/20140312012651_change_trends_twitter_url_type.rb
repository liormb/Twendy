class ChangeTrendsTwitterUrlType < ActiveRecord::Migration
  def change
  	change_column :trends, :twitter_url, :text
  end
end
