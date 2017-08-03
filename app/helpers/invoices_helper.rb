module InvoicesHelper
	def invoices_section?
		controller.controller_name == 'invoices'
	end
end
