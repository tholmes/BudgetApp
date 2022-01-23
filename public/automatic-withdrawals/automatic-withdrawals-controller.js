var app = angular.module("autoWithdrawalsApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);
app.directive("automaticWithdrawalsTab", function ($http, $uibModal) {
  return {
    templateUrl : "automatic-withdrawals/automatic-withdrawals.html",
    link: link,
    scope: {
      autoWithdrawals: "=",
    }
  };
  
  function link(scope, element, attrs) {

    function handleResponse(response) {
      if (response.data.error) {
        // TODO: put this in an error notification
        return;
      }
      var autoWithdrawal = response.data;
      var index = _.findIndex(scope.autoWithdrawals, { id: autoWithdrawal.id });
      if (index === -1) { // New auto Withdrawal
        scope.autoWithdrawals.push(autoWithdrawal);
      } else { // Existing auto Withdrawal
        scope.autoWithdrawals[index] = autoWithdrawal;
      }
    }

    function deleteAutoPay(item) {
      $http.delete("/api/automatic-withdrawals/" + item.id)
      .then(function (response) {
        if (response.data.error) {
          // Report error
        } else {
          _.remove(scope.autoWithdrawals, { id: item.id });
        }
      });
    }

    function openAutoPayModal(item) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'automatic-withdrawals/automatic-withdrawal.html',
        controller: "automaticWithdrawalCtrl",
        size: "sm",
        resolve: { data: function () { return {
          automaticWithdrawal: item
        } } }
      });
      
      modalInstance.result.then(function (data) {
        if (data.id) { // PUT
          $http.put("/api/automatic-withdrawals/" + data.id, data)
          .then(handleResponse);
        } else { // POST
          $http.post("/api/automatic-withdrawals/", data)
          .then(handleResponse);
        }
      }, function () {
        // Here if dismiss (cancel) was clicked
      });
    };

    /*
    scope.$watch("categories", function (newValues, oldValues, scope) {
      var categoriesChecked = _.filter(scope.categories, { isChecked: true });
      var total = 0.00;
      _.forEach(categoriesChecked, function (category) {
        total += parseFloat(category.allocation);
      });
      scope.total = total.toFixed(2);
    }, true);
    */
    
    scope.deleteAutoPay = deleteAutoPay;
    scope.openAutoPayModal = openAutoPayModal;
  }
});

app.controller("automaticWithdrawalCtrl", function ($scope, $uibModalInstance, data) {
  
  var category = data.category;
  $scope.title = "Create";

  if (category) {
    $scope.title = "Edit";
    $scope.category_id = category.category_id;
    $scope.categoryName = category.category;
    $scope.categoryBalance = category.balance;
    $scope.categoryAllocation = category.allocation;
  }

  function create() {
    var output = {
      category: $scope.categoryName,
      balance: $scope.categoryBalance,
      allocation: $scope.categoryAllocation
    };

    $uibModalInstance.close(output);
  };

  function update() {
    var output = {
      category_id: $scope.category_id,
      category: $scope.categoryName,
      balance: $scope.categoryBalance,
      allocation: $scope.categoryAllocation
    };

    $uibModalInstance.close(output);
  };

  function cancel() {
    $uibModalInstance.dismiss("cancel");
  };

  $scope.create = create;
  $scope.update = update;
  $scope.cancel = cancel;

});
