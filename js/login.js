const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('../db/texts.sqlite');

const path = require('path');
const dbPath = path.resolve(__dirname, 'texts.sqlite');
const db = new sqlite3.Database(dbPath);

const JWTSECRET = require('./secret.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



module.exports = (function() {
    var jWtsecret = toString(JWTSECRET);

    console.log('JWTSECRET is type:', typeof JWTSECRET);
    console.log('jWtsecret is type:', typeof jWtsecret);
    //check password and log in user
    
    function login(res, req) {
        // get username and password
        const plainPw = req.body.password;
        const username = req.body.username;

        //check if there is required content
        if (!username || !plainPw) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "username or password missing",
                    detail: "username or password missing"
                }
            });
        }

        //get user from database
        db.get("SELECT * FROM users WHERE username = ?",
            username,
            (err, rows) => {

                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            title:  "Database Error",
                            detail: err.message
                        }
                    });
                }

                //chech if username is missing from database
                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "username not found."
                        }
                    });
                }
                
                const user = rows;

                //do not use abbreviation of 'result' as 'res' is used with json response code
                bcrypt.compare(plainPw, user.password, (err, result) => {
                    //check for error in bcrypt
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/login",
                                title: "bcrypt Error",
                                detail: err.message
                            }
                        });
                    }

                    //handle result
                    if (result) {
                        const content = {username: user.username};
                        const secret = jWtsecret;
                        const token = jwt.sign(content, secret, { expiresIn: '1h'});

                        return res.json({
                            data: {
                                type: "success",
                                source: "/login",
                                message: "user is logged in",
                                user: content,
                                token: token
                            }
                        });
                    } else {
                        return res.status(401).json({
                            errors: {
                                status: 401,
                                title: "Wrong password",
                                detail: "wrong password"
                            }
                        });
                    }
                });
            }
        )
    }

    //check jwt token for user authentication
    function checkJVT(req, res, next) {
        var token = req.headers['x-access-token'];

        //console.log(req.headers, token);
        if (token) {
            // jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            jwt.verify(token, jWtsecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Authentication Failed",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.token = decoded.token;
                req.user.username = decoded.username;

                next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No jwt token provided in request headers"
                }
            });
        }
    }


    return {login: login, checkJVT: checkJVT};
}());
