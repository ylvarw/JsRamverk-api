var express = require('express');
var router = express.Router();

const createUser = require('../js/createUser');

router.post('/', (req, res) => createUser.hashPass(req, res));

module.exports = router;
