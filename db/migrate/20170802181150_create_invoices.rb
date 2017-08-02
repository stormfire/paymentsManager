class CreateInvoices < ActiveRecord::Migration[5.1]
  def change
    create_table :invoices do |t|
      t.integer :number
      t.integer :amount
      t.date :date
      t.text :to_address
      t.text :from_address
      t.text :notes

      t.timestamps
    end
  end
end
