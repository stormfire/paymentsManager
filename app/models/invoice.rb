class Invoice < ApplicationRecord
	belongs_to :user

	validates :number, :amount, :date, :to_address, :from_address, presence: true
	validates :number,
						uniqueness: { scope: :user, message: "cannot be duplicate for a user." }

	validates :amount,
						:numericality => { :greater_than_or_equal_to => 0, message: 'must be a positive value. ' }
end
