const DATABASE_HOME = process.env.LOCALAPPDATA + "/BudgetApp/";
const DATABASE = DATABASE_HOME + "budget.db";
const fs = require("fs");
const sqlite3 = require("sqlite3");
const GUID = require("uuid/v1");
const _ = require("lodash");

// Check if DATABASE_HOME exists
if (!fs.existsSync(DATABASE_HOME)) {
  fs.mkdirSync(DATABASE_HOME)
}

var db = new sqlite3.Database(DATABASE);
require("./database-create").create(db);
db.close();

function databaseObjToRspObj(values) {
  return _.mapKeys(values, function (value, key) {
    return _.trim(key, "$");
  });
}

class SqlResponse {
  constructor(error, data) {
    this.response = {};
    if (error) {
      this.response.error = error;
    }
    this.data = data;
  }
  read(cb) {
    if (!this.response.error) {
      this.response = this.data;
    }
    cb(this.response);
  }
  write(cb) {
    if (!this.response.error) {
      this.response = databaseObjToRspObj(this.data);
    }
    cb(this.response);
  }
}

function createCategory(cb, category) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $category_id: GUID(),
    $balance: category.balance || 0.00,
    $category: category.category,
    $allocation: category.allocation || 0.00
  };
  db.run(
    "INSERT INTO categories " +
    "(category_id, category, balance, allocation) " +
    "VALUES ($category_id, $category, $balance, $allocation)",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

function readCategory(cb, category_id) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $category_id: category_id
  };
  var sql = {
    single: "SELECT * FROM categories WHERE category_id = $category_id",
    all: "SELECT * FROM categories"
  }  
  db.all(
    sql[category_id ? "single" : "all"],
    values,
    function (error, rows) {
      new SqlResponse(error, rows).read(cb);
    }
  );
  db.close();
}

function updateCategory(cb, category_id, category) {
var db = new sqlite3.Database(DATABASE);
  var values = {
    $category: category.category,
    $balance: category.balance,
    $allocation: category.allocation,
    $category_id: category_id
  };
  db.run(
    "UPDATE categories " +
    "SET category = $category, balance = $balance, allocation = $allocation " +
    "WHERE category_id = $category_id",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

function deleteCategory(cb, category_id) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $category_id: category_id
  };
  db.run(
    "DELETE FROM categories " +
    "WHERE category_id = $category_id",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

function migrateTransaction(db, transaction) {
  var transactionValues = {
    $transaction_id: GUID(),
    $username: transaction.username,
    $category: transaction.category,
    $type: transaction.type,
    $previous_balance: transaction.previous_balance,
    $amount: transaction.amount,
    $new_balance: transaction.new_balance,
    $memo: transaction.memo,
    $date: transaction.date
  };
  db.run(
    "INSERT INTO transactions " +
    "(transaction_id, username, category, type, previous_balance, amount, new_balance, memo, date) " +
    "VALUES ($transaction_id, $username, $category, $type, $previous_balance, $amount, $new_balance, $memo, $date)",
    transactionValues,
    function (error) {
      if (error){
        console.log(error);
        console.log(transactionValues);
        console.log("----------------");
      }
    }
  );
}

function createTransaction(cb, transaction) {
  var db = new sqlite3.Database(DATABASE);
  var transactionValues = {
    $transaction_id: GUID(),
    $username: transaction.username,
    $category: transaction.category,
    $type: transaction.type,
    $previous_balance: transaction.previous_balance,
    $amount: transaction.amount,
    $new_balance: transaction.new_balance,
    $memo: transaction.memo,
    $date: transaction.date
  };
  var categoryValues = {
    $category_id: transaction.category_id,
    $balance: transaction.new_balance
  };
  db.run(
    "INSERT INTO transactions " +
    "(transaction_id, username, category, type, previous_balance, amount, new_balance, memo, date) " +
    "VALUES ($transaction_id, $username, $category, $type, $previous_balance, $amount, $new_balance, $memo, $date)",
    transactionValues,
    function (error) {
      if (error) {
        new SqlResponse(error).write(cb);
      } else {
        db.run(
          "UPDATE categories " +
          "SET balance = $balance " +
          "WHERE category_id = $category_id",
          categoryValues,
          function (error) {
            new SqlResponse(error, _.merge(transactionValues, { $category_id: transaction.category_id })).write(cb);
         });
      }
    }
  );
  db.close();
}

function readTransaction(cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {};
  db.all(
    "SELECT * FROM transactions",
    values,
    function (error, rows) {
      new SqlResponse(error, rows).read(cb);
    }
  );
  db.close();
}

function createAccount(cb, account) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $account_id: GUID(),
    $username: account.username,
    $password: account.password
  };
  db.run(
    "INSERT INTO accounts " +
    "(account_id, username, password) " +
    "VALUES ($account_id, $username, $password)",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

function readAccount(cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {};
  db.all(
    "SELECT * FROM accounts",
    values,
    function (error, rows) {
      new SqlResponse(error, rows).read(cb);
    }
  );
  db.close();
}

function createAutomaticWithdrawal(autoWithdrawal, cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $id: GUID(),
    $category_id: autoWithdrawal.category_id,
    $category: autoWithdrawal.category,
    $amount: autoWithdrawal.amount,
    $memo: autoWithdrawal.memo,
    $date: autoWithdrawal.date,
    $repeat: autoWithdrawal.repeat
  };
  db.run(
    "INSERT INTO automatic_withdrawals " +
    "(id, category_id, category, amount, memo, date, repeat) " +
    "VALUES ($id, $category_id, $category, $amount, $memo, $date, $repeat)",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

function readAutomaticWithdrawals(cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {};
  db.all(
    `SELECT * FROM automatic_withdrawals`,
    values,
    function (error, rows) {
      new SqlResponse(error, rows).read(cb);
    }
  );
  db.close();
}

function readExpiredAutomaticWithdrawals(nowMs, cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {};
  db.all(
    `SELECT * FROM automatic_withdrawals WHERE date <= ${nowMs}`,
    values,
    function (error, rows) {
      new SqlResponse(error, rows).read(cb);
    }
  );
  db.close();
}

function deleteAutomaticWithdrawal(autoWithdrawalId, cb) {
  var db = new sqlite3.Database(DATABASE);
  var values = {
    $id: autoWithdrawalId
  };
  db.run(
    "DELETE FROM automatic_withdrawals " +
    "WHERE id = $id",
    values,
    function (error) {
      new SqlResponse(error, values).write(cb);
    }
  );
  db.close();
}

// Category CRUD
exports.createCategory = createCategory;
exports.readCategory = readCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;

// Transaction CRUD
exports.createTransaction = createTransaction;
exports.readTransaction = readTransaction;

// Account CRUD
exports.createAccount = createAccount;
exports.readAccount = readAccount;

// Migration
exports.migrateTransaction = migrateTransaction;

// Automatic Withdrawals
exports.createAutomaticWithdrawal = createAutomaticWithdrawal;
exports.readAutomaticWithdrawals = readAutomaticWithdrawals;
exports.readExpiredAutomaticWithdrawals = readExpiredAutomaticWithdrawals;
exports.deleteAutomaticWithdrawal = deleteAutomaticWithdrawal;
