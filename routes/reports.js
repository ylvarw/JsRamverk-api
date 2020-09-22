var express = require('express');
var router = express.Router();

var report = require("../js/kmoms.js");

//använd JWT för auth
var auth = require("../js/login")

router.post("/",
(req, res, next) => auth.checkJVT(req, res, next),
(req, res) => report.createReport(res, req.body));

router.get("/:kmom",
(req, res) => report.getReport(req, res));

module.exports = router;
