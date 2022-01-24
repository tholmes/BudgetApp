const express = require("express");
const route = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const database = require("./database-functions");
const automaticWithdrawals = require("./automatic-withdrawals");
const path = require("path");

route.use(express.static(path.join(__dirname, 'public')));

route.post("/api/category", jsonParser, function (req, res) {
  database.createCategory(data => {
    res.json(data);
  }, req.body);
});

route.get("/api/category", function (req, res) {
  database.readCategory(data => {
    res.json(data);
  });
});

route.get("/api/category/:category_id", function (req, res) {
  database.readCategory(data => {
    res.json(data);
  }, req.params.category_id);
});

route.put("/api/category/:category_id", jsonParser, function (req, res) {
  database.updateCategory(data => {
    res.json(data);
  }, req.params.category_id, req.body);
});

route.delete("/api/category/:category_id", function (req, res) {
  database.deleteCategory(data => {
    res.json(data);
  }, req.params.category_id);
});

route.post("/api/transaction", jsonParser, function (req, res) {
  database.createTransaction(data => {
    res.json(data);
  }, req.body);
});

route.get("/api/transaction", function (req, res) {
  database.readTransaction(data => {
    res.json(data);
  });
});

route.post("/api/automatic-withdrawals", jsonParser, function (req, res) {
  database.createAutomaticWithdrawal(req.body, data => {
    res.json(data);
  });
});

route.put("/api/automatic-withdrawals/:id", jsonParser, function (req, res) {
  database.updateAutomaticWithdrawals(req.params.id, req.body, data => {
    res.json(data);
  });
});

route.get("/api/automatic-withdrawals", function (req, res) {
  database.readAutomaticWithdrawals(data => {
    res.json(data);
  });
});

route.delete("/api/automatic-withdrawals/:id", function (req, res) {
  database.deleteAutomaticWithdrawal(req.params.id, data => {
    res.json(data);
  });
});

route.post("/api/account", jsonParser, function (req, res) {
  database.createAccount(data => {
    res.json(data);
  }, req.body);
});

route.get("/api/account", function (req, res) {
  database.readAccount(data => {
    res.json(data);
  });
});

route.all("/api/*", function (req, res) {
  res.status(404).end("NOT FOUND");
});
 
route.listen(3000);

automaticWithdrawals.initialize();
