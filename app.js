const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');

//cookies for saving JVT
const cookies = require("cookie-parser");
const app = express();
const port = 1337;

// require the routes
const mepage = require("./routes/me.js");
const kmom01 = require("./routes/kmom01.js");
const reports = require("./routes/reports.js");
const register = require("./routes/register.js");
const login = require("./routes/login.js");
const test = require('./routes/test');

// console.log("tjosan");

// parsing application/json
app.use(bodyParser.json()); 

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookies());
app.use(morgan('dev'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log to command line
    // 'combined' outputs Apache style LOGs
    app.use(morgan('combined')); 
}

app.use('/login', login);
app.use('/register', register);
app.use('/reports/week/1', kmom01);
app.use('/reports/week/:kmom', reports);
app.use('/test', test);
app.use('/', mepage);


// app.use('/reports/week/1', kmom01);
// app.use('/reports/week/2', kmom02);


app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
app.listen(port, () => console.log(`me-API listening on port ${port}!`));