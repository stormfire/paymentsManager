# require 'rest-client'
require 'httparty'

module FixerIO
  # ACCESS_KEY = '83bb62473623f46c87a3e8b67e1ecf4d'
  # BASE_URL = 'http://data.fixer.io/api/'
  BASE_URL = 'https://api.exchangeratesapi.io/'
  class << self
    # http://api.fixer.io/latest?base=USD&symbols=GBP
    # https://api.exchangeratesapi.io/latest?base=USD&symbols=GBP
    def exchange_rate(from = 'USD', to = 'GBP')
      response = get('latest', {:query => {:base => from, :symbols => to}})
      response['rates']['GBP']
    end

    private

    def get(path = nil, options = {})
      query = options[:query]
      query = query ? ['?', query.to_query].join : nil
      puts "query : #{query}"
      url = [BASE_URL, path, query].join
      puts "URL : #{url}"
      begin
        HTTParty.get(url).try{parsed_response}
      rescue Exception => e
        puts e.message
        puts e.backtrace.join('\n')
      end
    end

  end

end