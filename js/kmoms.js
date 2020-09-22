const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('../db/texts.sqlite');

const path = require('path');
const dbPath = path.resolve(__dirname, 'texts.sqlite');
const db = new sqlite3.Database(dbPath);


module.exports = (function() {
    function createReport(res, body) {
        var kmom = body.kmom;
        var content = body.content;

        //check if required content is missing
        if (!kmom || !content) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/reports",
                    title: "missing required content",
                    detail: "missing kmom or content for the request"
                }
            });
        }

        //insert data to database
        db.run("INSERT INTO texts (kmom, content) VALUES (?, ?)",
        kmom,
        content, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/reports",
                        title: "Database Error",
                        detail: err.message
                    }
                });
            }

            res.status(201).json({
                data: {
                    msg: kmom + "with textcontent: " + content
                }
            });
        });
    }

    function getReport(req, res) {
        var kmom = req.params.kmom;
        
        //get the kmom from database
        db.get("SELECT * FROM texts WHERE kmom = ?",
        kmom,
        (err, rows) => {
            //handle errors
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/reports/" + kmom,
                        title: "Database Error",
                        detail: err.message
                    }
                });
            }

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/reports/" + kmom,
                        title: kmom + " not found",
                        detail: "selected kmom not found in database."
                    }
                });
            }

            const kmomtext = rows;

            req.status(201).json({
                data: {
                    content: kmomtext.json
                }
            });
        });
    }


    return { createReport: createReport, getReport: getReport };
}());