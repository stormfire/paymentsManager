class AddUserRefToInvoices < ActiveRecord::Migration[5.1]
  def change
    add_reference :invoices, :user, foreign_key: true
  end
end
