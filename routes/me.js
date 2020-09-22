var express = require('express');
var router = express.Router();
const me = require('../js/me-page.js');

router.get('/', function(req, res) {
    var info = me.info.data();

    res.json(info);
});

module.exports = router;