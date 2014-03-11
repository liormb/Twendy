class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string :name
      t.integer :woeid
      t.timestamp :trends_updated

      t.timestamps
    end
  end
end
