const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('../db/texts.sqlite');

const path = require('path');
const dbPath = path.resolve(__dirname, 'texts.sqlite');
const db = new sqlite3.Database(dbPath);

const bcrypt = require('bcryptjs');

//give higher value for harder password
const saltRounds = 10;


module.exports = (function() {
    //register user with hashed password
    function hashPass(req, res) {
        const plainPw = req.body.password;
        const username = req.body.username;

        //check if there is required content
        if (!username || !plainPw) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "username or password missing",
                    detail: "username or password missing"
                }
            });
        }

        bcrypt.hash(plainPw, saltRounds, function(err, hash) {
            //catch errors
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        title: "bcrypt: error",
                        detail: err.message
                    }
                });
            }

            //create user in database
            db.run("INSERT INTO users (username, password) VALUES (?, ?)",
            username,
            hash, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/register",
                            title: "Database Error",
                            detail: err.message
                        }
                    });
                }

                //successfully added to database
                res.status(201).json({
                    data: {
                        msg: "user " + username + " is now registered successfully with " + hash
                    }
                });
            });
        });
    }

    return {hashPass: hashPass};
}());