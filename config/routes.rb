Rails.application.routes.draw do
  devise_for :users
  resources :invoices
  
  root 'invoices#index'
end
