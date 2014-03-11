class CreateCountriesTrends < ActiveRecord::Migration
  def change
    create_table :countries_trends do |t|
      t.integer :trend_id
      t.integer :country_id
      t.integer :rank
      t.timestamp :time_of_trend

      t.timestamps
    end
  end
end
