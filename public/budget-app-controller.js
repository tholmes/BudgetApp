var app = angular.module('budgetApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap',
                                // List Apps Here
                                "balancesApp",
                                "transactionsApp",
                                "allocationsApp",
                                "historyApp",
                                "autoWithdrawalsApp",
                              ]);
app.controller('budgetAppCtrl', function($scope, $http, $q) {

  $scope.alerts = [];
  $scope.closeAlert = function(index) {
    //$scope.alerts.splice(index, 1);
    $scope.alerts.splice(0, 1);
  };

  $scope.isSignedIn = true;
  $scope.isLoaded = false;
  $scope.total = 0.00;

  var promises = {
    promiseCategories: $http.get("/api/category"),
    promiseTransactions: $http.get("/api/transaction"),
    promiseAutoWithdrawals: $http.get("/api/automatic-withdrawals"),
  };

  $q.all(promises).then(responses => {
    $scope.categories = responses.promiseCategories.data;
    $scope.transactions = deserializeTransactions(responses.promiseTransactions.data);
    $scope.autoWithdrawals = responses.promiseAutoWithdrawals.data;
    updateTotal();
    $scope.isLoaded = true;
  });

  function deserializeTransactions(transactions) {
    return _.map(transactions, function (transaction) {
      return {
        transaction_id: transaction.transaction_id,
        username: transaction.username,
        category: transaction.category,
        previous_balance: parseFloat(transaction.previous_balance).toFixed(2),
        amount: parseFloat(transaction.amount).toFixed(2),
        new_balance: parseFloat(transaction.new_balance).toFixed(2),
        type: transaction.type,
        memo: transaction.memo,
        date: transaction.date
      };
    });
  }

  function updateTotal() {
    var total = 0.00;
    _.forEach($scope.categories, function (category) {
      total += parseFloat(category.balance);
    });
    $scope.total = total.toFixed(2);
  }

  $scope.updateTotal = updateTotal;
  
});
