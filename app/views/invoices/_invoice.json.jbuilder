json.extract! invoice, :id, :number, :amount, :date, :to_address, :from_address, :notes, :created_at, :updated_at
json.url invoice_url(invoice, format: :json)
