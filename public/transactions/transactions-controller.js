var app = angular.module("transactionsApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload', 'ngMaterial', 'ngMessages']);
app.directive("transactionsTab", function ($http, $uibModal, Upload, $q) {
  return {
    templateUrl : "transactions/transactions.html",
    link: link,
    scope: {
      transactions: "=",
      categories: "=",
      updateTotal: "&",
      alerts: "="
    }
  };
  
  function link(scope, element, attrs) {

    var today = new Date();

    scope.withdrawal = {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };
    scope.transfer = {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };
    scope.deposit = {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    };

    const OPERATION = {
      WITHDRAWAL: function (lhs, rhs) {
        return (parseFloat(lhs) - parseFloat(rhs)).toFixed(2);
      },
      DEPOSIT: function (lhs, rhs) {
        return (parseFloat(lhs) + parseFloat(rhs)).toFixed(2);
      }
    };

    const TYPE = {
      WITHDRAWAL: "WITHDRAWAL",
      DEPOSIT: "DEPOSIT"
    };

    const ALL = "- ALL Selected -";

    function getBalance(selectedCategory) {
      if (selectedCategory) {
        return parseFloat(selectedCategory.balance).toFixed(2);
      }
      return "-.--";
    }

    function isNegative(selectedCategory) {
      if (selectedCategory) {
        return parseFloat(selectedCategory.balance).toFixed(2) < 0;
      }
      return false;
    }

    function sendTransaction(transaction, cb) {      
      $http.post("/api/transaction", transaction)
      .then((response) => {
        if (response.data.error) {
          scope.alerts.push({ type: "danger", msg: response.data.error });
          return;
        }
        scope.transactions.push(response.data);
        var index = _.findIndex(scope.categories, { category_id: response.data.category_id });
        scope.categories[index].balance = response.data.new_balance;
        scope.updateTotal();
        if (cb) {
          return cb();
        }
        // TODO: for now, clear previous alert(s) (only show one at a time)
        // create a message tie a message id (and maybe description) to a request and a response
        var message = "Transaction Complete!";
        scope.alerts.splice(0, 1);
        scope.alerts.push({ type: "success", msg: message });
      });
    }

    function formTransaction(username, type, obj) {
      return {
        username: username,
        type: type,
        category_id: obj.selectedCategory.category_id,
        category: obj.selectedCategory.category,
        previous_balance: parseFloat(obj.selectedCategory.balance).toFixed(2),
        amount: parseFloat(obj.amount).toFixed(2),
        new_balance: OPERATION[type](obj.selectedCategory.balance, obj.amount),
        memo: obj.memo,
        date: obj.date.getTime()/1000
      };
    }

    function makeWithdrawal() {
      sendTransaction(formTransaction("", TYPE.WITHDRAWAL, scope.withdrawal));
    }

    function makeTransfer() {
      var copyOfTransfer = _.assign({}, scope.transfer);
      _.omit(copyOfTransfer, "selectedToCategory, selectedFromCategory");

      var transferWithdrawal = _.assign({}, copyOfTransfer);
      transferWithdrawal.selectedCategory = scope.transfer.selectedFromCategory;
      sendTransaction(formTransaction("", TYPE.WITHDRAWAL, transferWithdrawal));
      
      var transferDeposit = _.assign({}, copyOfTransfer);
      transferDeposit.selectedCategory = scope.transfer.selectedToCategory;
      sendTransaction(formTransaction("", TYPE.DEPOSIT, transferDeposit));
    }

    function depositAll(index, size) {
      if (index === size) {
        // TODO: for now, clear previous alert(s) (only show one at a time)
        // create a message tie a message id (and maybe description) to a request and a response
        var message = "Transaction Complete!";
        scope.alerts.splice(0, 1);
        scope.alerts.push({ type: "success", msg: message });
        return;
      }
      var deposit = _.pick(scope.deposit, ["date", "memo"]);
      deposit.selectedCategory = scope.categoriesChecked[index];
      deposit.amount = parseFloat(scope.categoriesChecked[index].allocation).toFixed(2);
      // TODO: for now, clear previous alert(s) (only show one at a time)
      // create a message tie a message id (and maybe description) to a request and a response
      var message = "Depositing $" + deposit.amount + " into '" + deposit.selectedCategory.category +
                    "'<br>(" + (100*index/size).toFixed(0) + "% complete)";
      scope.alerts.splice(0, 1);
      scope.alerts.push({ type: "info", msg: message });
      if (deposit.amount > 0.00) { // No need to send "deposits" with zero amounts
        sendTransaction(formTransaction("", TYPE.DEPOSIT, deposit), function() {
          depositAll(++index, size);
        });
      } else {
        depositAll(++index, size);
      }
    }

    function makeDeposit() {
      if (scope.deposit.selectedCategory.category === ALL) {
       depositAll(0, scope.categoriesChecked.length);
      } else {
        if (_.isEmpty(scope.deposit.gross)) {
          // Find all categories with special flag and create a Deposit Transaction for each,
        }
        // Create a Deposit Transaction with "Amount" funds for selected category
        sendTransaction(formTransaction("", TYPE.DEPOSIT, scope.deposit));
      }
    }

    function showDepositAmount() {
      return _.get(scope, "deposit.selectedCategory.category", ALL) != ALL;
    }

    function showDepositGross() {
      return _.get(scope, "deposit.selectedCategory.category", "") === ALL;
    }

    scope.$watch("categories", function (newValues, oldValues, scope) {
      scope.adjustedCategories = _.assign([], scope.categories);
      var categoryAll = {
        category: ALL
      };
      scope.categoriesChecked = _.filter(scope.adjustedCategories, { isChecked: true });
      if (scope.categoriesChecked.length > 1) {
        scope.adjustedCategories.push(categoryAll);
      }

      var total = 0.00;
      _.forEach(scope.categoriesChecked, function (category) {
        total += parseFloat(category.allocation);
      });
      scope.deposit.gross = total.toFixed(2);
    }, true);

    scope.getBalance = getBalance;
    scope.isNegative = isNegative;
    scope.makeWithdrawal = makeWithdrawal;
    scope.makeTransfer = makeTransfer;
    scope.makeDeposit = makeDeposit;
    scope.showDepositAmount = showDepositAmount;
    scope.showDepositGross = showDepositGross;
  }
});
