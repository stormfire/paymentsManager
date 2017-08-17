'use strict';
var app = angular.module('paymentsManager', [
	'templates',
	'ngRoute',
	'ngResource',
	'ui.bootstrap'
	]);

// application configuraton
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "index.html",
		controller: 'InvoicesController'
	});
}]);

// Invoice factory
app.factory('Invoice', function($resource) {
	return $resource('/invoices/:invoiceId',
		{ invoiceId: "@id", format: 'json' },
		{
			update: {
				method: 'PUT' 
			}
		});
});

// Payment factory
app.factory('Payment', function($resource) {
	return $resource('/invoices/:invoice_id/payments/:id',
		{ invoice_id: "@invoice_id", id: "@id", format: 'json' }
		);
});


// Invoice Controller
app.controller('InvoicesController', ['$scope', '$routeParams', '$resource', '$uibModal', '$log', 'Invoice', 'Payment',
	function($scope, $routeParams, $resource, $uibModal, $log, Invoice, Payment) {
		$scope.invoices = Invoice.query(function(response) {
		}); 

		$scope.showPaymentFrm = false;
		// modal
		$scope.show = function (invoice) {
			$scope.invoice = invoice;
			$scope.invoice.date = new Date($scope.invoice.date);
			$scope.invoice.updated_at = new Date($scope.invoice.updated_at);


			var modalInstance = $uibModal.open({
				templateUrl: 'invoice.html',
				controller: ShowInvoiceModalCtrl,
				scope: $scope,
				resolve: {
					invoice: function () {
						return $scope.invoice;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.openInvoiceForm = function (invoice, invoiceIndex) {

			$scope.invoice = new Invoice();
			$scope.invoiceIndex = invoiceIndex;
			if ( $scope.invoiceIndex !== null && typeof $scope.invoiceIndex !== 'undefined' ) {
				$scope.invoice = angular.copy(invoice);
				$scope.invoice.date = new Date($scope.invoice.date);
				$scope.invoice.updated_at = new Date($scope.invoice.updated_at);
			}

			var modalInstance = $uibModal.open({
				templateUrl: 'invoiceForm.html',
				controller: InvoiceFormModalCtrl,
				scope: $scope,
				resolve: {
					invoice: function () {
						return $scope.invoice;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function (data) {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.showPaymentForm =function() {
			$scope.payment = new Payment({invoice_id: $scope.invoice.id});
			$scope.showPaymentFrm = true ;
		}

		$scope.showPaymentFormErrors = function(){
			return !$scope.paymentForm.$valid && ($scope.paymentForm.$dirty || $scope.paymentForm.$submitted)

		}

		$scope.makePayment = function(){
			console.log($scope.payment)
			Payment.save($scope.payment,
				function(payment){
					$scope.payment = payment;
					$scope.payment.date = new Date(payment.date);
					$scope.payment.updated_at = new Date(payment.updated_at);
					$scope.invoice.payments.push($scope.payment);
					$scope.showPaymentFrm = false ;
					$scope.payment = null			
				},
				function(error){
					console.log("ERROR =>" + error.status);
					console.log(error.data);
				});
		};
	}]);

var ShowInvoiceModalCtrl= function ($scope, $uibModalInstance, invoice) {
	$scope.invoice = invoice;

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};

var InvoiceFormModalCtrl = function ($scope, $uibModalInstance, Invoice, invoice) {
	$scope.invoice = invoice;
	$scope.formHeading = 'Create Invoice!'
	if (invoice.id) {
		$scope.formHeading = 'Update Invoice!'
	}

	$scope.showFormErrors = function () {
		return !$scope.invoiceForm.$valid && ($scope.invoiceForm.$dirty || $scope.invoiceForm.$submitted)
	}

	$scope.ok = function () {
		if ($scope.invoiceForm.$valid) {
			if (typeof $scope.invoice.id == 'undefined')  {
				createInvoice();
			} else {
				updateInvoice();
			}
		}
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	var createInvoice = function(){
		Invoice.save($scope.invoice,
			function(invoice){
				$scope.invoice = invoice;
				$scope.invoice.date = new Date(invoice.date);
				$scope.invoice.updated_at = new Date(invoice.updated_at);
				$scope.invoices.push($scope.invoice);
				$uibModalInstance.dismiss('ok');
			},
			function(error){
				console.log("ERROR =>" + error.status);
				console.log(error.data);
			});
	};

	var updateInvoice = function(){
		console.log("update invoice :" + $scope.invoice.id );
		Invoice.update({id: $scope.invoice.id}, $scope.invoice,
			function(invoice){
				$scope.invoice = invoice;
				$scope.invoice.date = new Date($scope.invoice.date);
				$scope.invoice.updated_at = new Date($scope.invoice.updated_at);
				$scope.invoices[$scope.invoiceIndex] = invoice;
				$uibModalInstance.dismiss('ok');
			},
			function(error){
				console.log("ERROR =>" + error.status);
				console.log(error.data);
			});
	};

};
