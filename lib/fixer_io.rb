require 'rest-client'

module FixerIO
	class << self

		# http://api.fixer.io/latest?base=USD&symbols=GBP
		def exchange_rate(from = 'USD', to = 'GBP')
			response = get('latest', 
									{ :query => {:base => from, :symbols => to} }
							)
			response.code == 200 ? JSON.parse(response)["rates"][to] : nil
		end

		private

		def get(path = nil, options = {})
			puts options.inspect
			query = options[:query].nil? ? '' : ['?', options[:query].to_query].join
			url = [ 'http://api.fixer.io/', path, query ].join
			RestClient.get(url, { accept: :json }.merge(options[:headers] || {}) )
		end
		
	end

end