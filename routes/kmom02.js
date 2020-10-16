var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const data = {
        data: {
            kmom: "02",
            content: "Mitt api för sidan finns på: https://github.com/ylvarw/JsRamverk-api " +
            "Setup: install dependencies with npm install " +
            "Setup database: "+
            "in js/ create texts.sqlite "+
            "run 'sqlite3 texts.sqlite "+
            "sqlite > .read migrate.sql "+
            "sqlite > .exit "+
            "Available Scripts: "+
            "In the project directory, you can run: " +
            "npm start: starts server on http://localhost:1337 " +
            
            "The server will reload if you make edits. "+
            "npm production: starts production server "+
            
            "npm test: Launches the test runner "
            
             
        }
    };

    res.json(data);
});

module.exports = router;