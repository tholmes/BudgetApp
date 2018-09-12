var app = angular.module("historyApp", ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngFileUpload']);
app.directive("historyTab", function ($http, $uibModal, Upload, $q) {
  return {
    templateUrl : "history/history.html",
    link: link,
    scope: {
      transactions: "="
    }
  };
  
  function link(scope, element, attrs) {

    const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    scope.COLUMNS = {
      DEFAULT: "",
      USERNAME: "username",
      CATEGORY: "category",
      TYPE: "type",
      AMOUNT: "amount",
      MEMO: "memo",
      DATE: "date"
    }

    scope.filteredTransactions = [];
    scope.reverseOrder = true;
    scope.orderColumn = scope.COLUMNS.DEFAULT;
    scope.radioDateFilter = "defaultDate";
    scope.tableFilter = "";

    var today = new Date();
    scope.startDate = new Date(today.getFullYear(), today.getMonth());
    scope.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    function filterByDate(transaction) {
      var transactionDate = new Date(null);
      transactionDate.setTime(parseInt(transaction.date, 10) * 1000);

      if (scope.radioDateFilter === "defaultDate") {
        return (today.getFullYear() === transactionDate.getFullYear()) &&
          (today.getMonth() === transactionDate.getMonth());
      } else { // Custom date range
        return (transactionDate.getTime() >= scope.startDate.getTime() &&
                transactionDate.getTime() <= scope.endDate.getTime());
      }
    }

    scope.defaultDateText = MONTH_NAMES[today.getMonth()] + " " + today.getFullYear();
    scope.orderTransactions = function () {
      return scope.orderColumn;
    };

    function sort(columnClicked) {
      if (scope.orderColumn === columnClicked) {
        scope.reverseOrder = !scope.reverseOrder;
      } else {
        scope.orderColumn = columnClicked;
        scope.reverseOrder = false;
      }
    }

    function filterByInput(transaction, inputFilter) {
      if (_.isEmpty(inputFilter)) {
        return true;
      }
      var matches = false;
      _.forEach(transaction, function (value, key) {
        if (_.includes(_.toLower(value), _.toLower(inputFilter))) {
          matches = true;
        }
      });
      return matches;
    }

    function filterTable(inputFilter) {
      // Filter by date      
      var filteredSoFar = _.filter(scope.transactions, function (transaction) {
        return filterByDate(transaction);
      });
      // Filter by input
      scope.filteredTransactions = _.filter(filteredSoFar, function (transaction) {
        return filterByInput(_.omit(transaction, "date"), inputFilter);
      });
    }

    scope.$watch("[transactions, radioDateFilter, startDate, endDate]", function (newValues, oldValues, scope) {
      filterTable();
    }, true);

    scope.$watch("tableFilter", function (newValue, oldValue, scope) {
      filterTable(newValue);
    }, true);
    
    function getTransNumber(transaction) {
      return _.findIndex(scope.filteredTransactions, { transaction_id: transaction.transaction_id }) + 1;
    };
    function getUsername(transaction) {
      return transaction.username;
    };
    function getCategory(transaction) {
      return transaction.category;
    };
    function getSign(transaction) {
      if (transaction.type === "WITHDRAWAL") {
        return "-";
      }
      return "+";
    };
    function getPrevBalance(transaction) {
      return transaction.previous_balance;
    };
    function getTransAmount(transaction) {
      return parseFloat(transaction.amount).toFixed(2);
    };
    function getNewBalance(transaction) {
      return transaction.new_balance;
    };
    function getMemo(transaction) {
      return transaction.memo;
    };
    function getDate(transaction) {
      var transactionDate = new Date(null);
      transactionDate.setTime(parseInt(transaction.date, 10) * 1000);
      return format(transactionDate.getMonth() + 1) + "/" + format(transactionDate.getDate()) + "/" + transactionDate.getFullYear();
    };

    function format(number) {
      if (number < 10 ) {
        return "0" + number;
      }
      return number;
    }

    scope.sort = sort;
    scope.getTransNumber = getTransNumber;
    scope.getUsername = getUsername;
    scope.getCategory = getCategory;
    scope.getPrevBalance = getPrevBalance;
    scope.getTransAmount = getTransAmount;
    scope.getNewBalance = getNewBalance;
    scope.getMemo = getMemo;
    scope.getDate = getDate;
    scope.getSign = getSign;
  }
});
