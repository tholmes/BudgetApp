const ONE_DAY_MS = 1/*day*/ * 24/*hour*/ * 60/*min*/ * 60/*sec*/ * 1000/*ms*/;
const HOUR_OF_DAY = 2;

const database = require("./database-functions");

function executeAutomaticWithdrawals() {
  var now = new Date();

  database.readExpiredAutomaticWithdrawals(now.getTime(), (rows) => {
    rows.forEach(autoWithdrawal => {

      database.readCategory((categories) => {
        var balance = categories[0].balance;
        var transaction = {
          username: "Automatic Withdrawal",
          category_id: autoWithdrawal.category_id,
          category: autoWithdrawal.category,
          type: "WITHDRAWAL",
          previous_balance: balance,
          amount: autoWithdrawal.amount,
          new_balance: balance - autoWithdrawal.amount,
          memo: autoWithdrawal.memo,
          date: now / 1000,
        };        
        database.createTransaction(() => {
          if (autoWithdrawal.repeat > 0) {
            rescheduleAutoWithdrawal(autoWithdrawal);
          }
          database.deleteAutomaticWithdrawal(autoWithdrawal, () => {});
        }, transaction);
      }, autoWithdrawal.category_id);

    });
  });
}

function rescheduleAutoWithdrawal(autoWithdrawal) {
  var date = new Date(autoWithdrawal.date);
  autoWithdrawal.date = (new Date(date.getFullYear(), date.getMonth() + autoWithdrawal.repeat, date.getDate(), HOUR_OF_DAY, 0, 0, 0)).getTime();
  database.createAutomaticWithdrawal(autoWithdrawal, () => {});
}

function startInervals() {
  setInterval(() => {
    executeAutomaticWithdrawals();
  }, ONE_DAY_MS);
}

function getMillisTillFirstOccurance() {
  var now = new Date();
  var millis = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), HOUR_OF_DAY, 0, 0, 0)).getTime() - now.getTime();
  if (millis < 0) {
    // It's passed the HOUR_OF_DAY, so add 1 day's worth of millis to the calculated millis
    millis += ONE_DAY_MS;
  }
  return millis;
}

function initialize() {
  executeAutomaticWithdrawals();
  // set first occurrance
  setTimeout(() => {
    executeAutomaticWithdrawals();
    startInervals();
  }, getMillisTillFirstOccurance());
}

exports.initialize = initialize;
