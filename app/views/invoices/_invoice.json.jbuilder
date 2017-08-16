json.extract! invoice, :id, :number, :amount, :amount_in_gbp, :date, :to_address, :from_address, :notes, :created_at, :updated_at, :payments
json.url invoice_url(invoice, format: :json)
