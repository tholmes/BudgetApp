function createDatabase(db) {
  db.serialize(function () {
    // Create CATEGORIES table
    db.run("CREATE TABLE if not exists categories " +
           "(" +
           "category_id TEXT UNIQUE, " +
           "category TEXT UNIQUE, " +
           "balance REAL, " +
           "allocation REAL, " +
           "PRIMARY KEY(category_id)" +
           ")");
    // Create TRANSACTIONS table
    db.run("CREATE TABLE if not exists transactions " +
    "(" +
    "transaction_id TEXT UNIQUE, " +
    "username TEXT, " +
    "category TEXT, " +
    "type TEXT CHECK(type IN ('WITHDRAWAL', 'DEPOSIT')), " +
    "previous_balance REAL, " +
    "amount REAL, " +
    "new_balance REAL, " +
    "memo TEXT, " +
    "date INTEGER, " +
    "PRIMARY KEY(transaction_id)" +
    ")");
    // Create ACCOUNTS table
    db.run("CREATE TABLE if not exists accounts " +
    "(" +
    "account_id TEXT UNIQUE, " +
    "username TEXT, " +
    "password TEXT, " +
    "PRIMARY KEY(account_id)" +
    ")");
    // Create SETTINGS table
    db.run("CREATE TABLE if not exists settings " +
    "(" +
    "version INTEGER" +
    ")");
  });
}

exports.create = createDatabase;
