var app = angular.module("balancesApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);
app.directive("balancesTab", function ($http, $uibModal, Upload, $q) {
  return {
    templateUrl : "balances/balances.html",
    link: link,
    scope: {
      categories: "=",
      total: "="
    }
  };
  
  function link(scope, element, attrs) {

    function getBalance(category) {
      return parseFloat(category.balance).toFixed(2);
    }

    function isNegative(category) {
      return getBalance(category) < 0.00;
    }
    
    scope.getBalance = getBalance;
    scope.isNegative = isNegative;
  }
});
