var app = angular.module("allocationsApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);
app.directive("allocationsTab", function ($http, $uibModal) {
  return {
    templateUrl : "allocations/allocations.html",
    link: link,
    scope: {
      categories: "=",
      updateTotal: "&"
    }
  };
  
  function link(scope, element, attrs) {

    function getAllocation(category) {
      return parseFloat(category.allocation).toFixed(2);
    }

    /**
     * deserializeCategory
     * @param {category_id, category, balance, allocation} src 
     */
    function deserializeCategory(src) {
      return {
        category_id: src.category_id,
        category: src.category,
        balance: src.balance,
        allocation: src.allocation
      }
    }

    function handleResponse(response) {
      if (response.data.error) {
        // TODO: put this in an error notification
        return;
      }
      var category = deserializeCategory(response.data);
      var index = _.findIndex(scope.categories, { category_id: category.category_id });
      if (index === -1) { // New category
        scope.categories.push(category);
      } else { // Existing category
        scope.categories[index] = category;
      }
      scope.updateTotal();
    }

    function deleteCategory(category) {
      $http.delete("/api/category/" + category.category_id)
      .then(response => {
        if (response.data.error) {
          // Report error
        } else {
          _.remove(scope.categories, { category_id: category.category_id });
        }
      });
    }

    function openCategoryModal(category) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'allocations/category.html',
        controller: "categoryCtrl",
        size: "sm",
        resolve: { data: function () { return {
          category: category
        } } }
      });
      
      modalInstance.result.then(data => {
        if (data.category_id) { // PUT
          $http.put("/api/category/" + data.category_id, _.omit(data, data.category_id))
          .then(handleResponse);
        } else { // POST
          $http.post("/api/category/", data)
          .then(handleResponse);
        }
      }, function () {
        // Here if dismiss (cancel) was clicked
      });
    };

    scope.allChecked = false;
    scope.allCheckedDisplay = scope.allChecked ? "Unselect All" : "Select All";

    function checkboxAllClicked() {
      scope.allChecked = !scope.allChecked;
      scope.allCheckedDisplay = scope.allChecked ? "Unselect All" : "Select All";
      _.forEach(scope.categories, function (category) {
        category.isChecked = scope.allChecked;
      });
    }

    scope.$watch("categories", function (newValues, oldValues, scope) {
      var categoriesChecked = _.filter(scope.categories, { isChecked: true });
      var total = 0.00;
      _.forEach(categoriesChecked, function (category) {
        total += parseFloat(category.allocation);
      });
      scope.total = total.toFixed(2);
    }, true);

    scope.deleteCategory = deleteCategory;
    scope.getAllocation = getAllocation;
    scope.openCategoryModal = openCategoryModal;
    scope.checkboxAllClicked = checkboxAllClicked;
  }
});

app.controller("categoryCtrl", function ($scope, $uibModalInstance, data) {
  
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
