var app = angular.module("autoWithdrawalsApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);
app.directive("automaticWithdrawalsTab", function ($http, $uibModal) {
  return {
    templateUrl : "automatic-withdrawals/automatic-withdrawals.html",
    link: link,
    scope: {
      autoWithdrawals: "=",
      categories: "=",
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
        size: "", // medium
        resolve: { data: function () { return {
          automaticWithdrawal: item,
          categories: scope.categories
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
    
    scope.deleteAutoPay = deleteAutoPay;
    scope.openAutoPayModal = openAutoPayModal;
  }
});

app.controller("automaticWithdrawalCtrl", function ($scope, $uibModalInstance, data) {
  
  $scope.categories = data.categories;
  
  var autoPay = data.automaticWithdrawal;
  $scope.title = "Create";

  if (autoPay) {
    $scope.title = "Edit";
    $scope.id = autoPay.id;
    $scope.category_id = autoPay.category_id;
    $scope.category = autoPay.category;
    $scope.selectedCategory = _.find($scope.categories, { category_id: autoPay.category_id });
    $scope.amount = autoPay.amount;
    $scope.memo = autoPay.memo;
    $scope.date = new Date(autoPay.date);
    $scope.repeat = autoPay.repeat;
  }

  function create() {
    var output = {
      category_id: $scope.selectedCategory.category_id,
      category: $scope.selectedCategory.category,
      amount: $scope.amount,
      memo: $scope.memo,
      date: $scope.date.getTime(),
      repeat: $scope.repeat,
    };

    $uibModalInstance.close(output);
  };

  function update() {
    var output = {
      id: $scope.id,
      category_id: $scope.selectedCategory.category_id,
      category: $scope.selectedCategory.category,
      amount: $scope.amount,
      memo: $scope.memo,
      date: $scope.date.getTime(),
      repeat: $scope.repeat,
    }

    $uibModalInstance.close(output);
  };

  function cancel() {
    $uibModalInstance.dismiss("cancel");
  };

  $scope.create = create;
  $scope.update = update;
  $scope.cancel = cancel;

});
