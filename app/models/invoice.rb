class Invoice < ApplicationRecord
	require 'fixer_io'

	include FixerIO
	belongs_to :user
	has_many :payments, dependent: :destroy

	validates :number, :amount, :date, :to_address, :from_address, presence: true
	validates :number,
						uniqueness: { scope: :user, message: "cannot be duplicate for a user." }

	validates :amount,
			      :numericality => { :greater_than_or_equal_to => 0, message: 'must be a positive value. ' }

	attr_reader :amount_in_gbp

	def total_payments
		payments.map(&:amount).sum
	end

	def payments_due
		amount - total_payments 
	end

	def payments_due?
		payments_due > 0
	end

	def amount_in_gbp
		rate =  FixerIO.exchange_rate
		puts "RATE : #{rate}"
		rate.nil? ? nil : rate * amount
	end

end
