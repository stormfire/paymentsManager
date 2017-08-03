class Payment < ApplicationRecord
	belongs_to :invoice

	validates :amount, :date, :invoice, presence: true
	validates :amount,
						:numericality => { :greater_than_or_equal_to => 0,
							:less_than_or_equal_to => Proc.new { |a| a.invoice.payments_due },
							message: 'must be a positive and less than or equal to remaining payment.' 
						}

	end
