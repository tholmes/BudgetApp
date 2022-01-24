const express = require("express");
const route = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const database = require("./database-functions");
const automaticWithdrawals = require("./automatic-withdrawals");
const path = require("path");

route.use(express.static(path.join(__dirname, 'public')));

route.post("/api/category", jsonParser, (req, res) => {
  database.createCategory(req.body, data => {
    res.json(data);
  });
});

route.get("/api/category", (req, res) => {
  database.readAllCategories(data => {
    res.json(data);
  });
});

route.get("/api/category/:category_id", (req, res) => {
  database.readCategory(req.params.category_id, data => {
    res.json(data);
  });
});

route.put("/api/category/:category_id", jsonParser, (req, res) => {
  database.updateCategory(req.params.category_id, req.body, data => {
    res.json(data);
  });
});

route.delete("/api/category/:category_id", (req, res) => {
  database.deleteCategory(req.params.category_id, data => {
    res.json(data);
  });
});

route.post("/api/transaction", jsonParser, (req, res) => {
  database.createTransaction(req.body, data => {
    res.json(data);
  });
});

route.get("/api/transaction", (req, res) => {
  database.readTransaction(data => {
    res.json(data);
  });
});

route.post("/api/automatic-withdrawals", jsonParser, (req, res) => {
  database.createAutomaticWithdrawal(req.body, data => {
    res.json(data);
  });
});

route.put("/api/automatic-withdrawals/:id", jsonParser, (req, res) => {
  database.updateAutomaticWithdrawals(req.params.id, req.body, data => {
    res.json(data);
  });
});

route.get("/api/automatic-withdrawals", (req, res) => {
  database.readAutomaticWithdrawals(data => {
    res.json(data);
  });
});

route.delete("/api/automatic-withdrawals/:id", (req, res) => {
  database.deleteAutomaticWithdrawal(req.params.id, data => {
    res.json(data);
  });
});

route.post("/api/account", jsonParser, (req, res) => {
  database.createAccount(req.body, data => {
    res.json(data);
  });
});

route.get("/api/account", (req, res) => {
  database.readAccount(data => {
    res.json(data);
  });
});

route.all("/api/*", (req, res) => {
  res.status(404).end("NOT FOUND");
});
 
route.listen(3000);

automaticWithdrawals.initialize();
