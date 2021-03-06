const express = require("express");
const route = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const database = require("./database-functions");
const path = require("path");

route.use(express.static(path.join(__dirname, 'public')));

route.post("/api/category", jsonParser, function (req, res) {
  database.createCategory(function (data) {
    res.json(data);
  }, req.body);
});

route.get("/api/category", function (req, res) {
  database.readCategory(function (data) {
    res.json(data);
  });
});

route.get("/api/category/:category_id", function (req, res) {
  database.readCategory(function (data) {
    res.json(data);
  }, req.params.category_id);
});

route.put("/api/category/:category_id", jsonParser, function (req, res) {
  database.updateCategory(function (data) {
    res.json(data);
  }, req.params.category_id, req.body);
});

route.delete("/api/category/:category_id", function (req, res) {
  database.deleteCategory(function (data) {
    res.json(data);
  }, req.params.category_id);
});

route.post("/api/transaction", jsonParser, function (req, res) {
  database.createTransaction(function (data) {
    res.json(data);
  }, req.body);
});

route.get("/api/transaction", function (req, res) {
  database.readTransaction(function (data) {
    res.json(data);
  });
});

route.post("/api/account", jsonParser, function (req, res) {
  database.createAccount(function (data) {
    res.json(data);
  }, req.body);
});

route.get("/api/account", function (req, res) {
  database.readAccount(function (data) {
    res.json(data);
  });
});

route.all("/api/*", function (req, res) {
  res.status(404).end("NOT FOUND");
});
 
route.listen(3000);
