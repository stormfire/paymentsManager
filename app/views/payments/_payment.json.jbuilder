json.extract! payment, :id, :amount, :date, :invoice_id, :created_at, :updated_at
json.url invoice_payment_url(@invoice.id, payment, format: :json)
