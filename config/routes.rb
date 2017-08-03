Rails.application.routes.draw do
  devise_for :users
  resources :invoices do 
  	resources :payments
  end
  
  
  scope 'api/v1/' do
  	# to get any users invoices list
  	get 'users/:user_id/invoices', to: 'invoices#user_invoices', format: :json
  end

  root 'invoices#index'


end
