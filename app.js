const express = require("express");
const mysql = require("mysql2");
var cors = require('cors');
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
const connection = mysql.createConnection({
host: "poemratingdb.cnhdhsbkw379.us-east-1.rds.amazonaws.com",
user: "Yorth",
password: "59nC7SkbLGxvgWme",
database: "Suggestion"
});

app.get("/get-poem", (req, res) => {
    connection.query(
        `SELECT start, continuations
        FROM PoemTable
        WHERE start in (SELECT start FROM PoemTable GROUP BY start HAVING count(start) >= 4)
        ORDER BY RAND()
        LIMIT 1`,
    (error, results) => {
    if (error) {
    return res.send({ error });
    }
    const start = results[0].start;
              connection.query(
                `SELECT continuations
                FROM PoemTable
                WHERE start = "${start}"
                ORDER BY RAND()
                LIMIT 4`,
                (error, results) => {
                    if (error) {
                      return reject(error);
                    }
                    const continuations = results.map(result => result.continuations);
                    const poem = {
                    start: start,
                    continuations: continuations
                    };
                    console.log(poem);
                    res.send(poem);
                }
                    );
    });});
    


app.post("/submit-ranking", (req, res) => {
console.log(req.body);
const { start, continuation, ranking } = req.body;
connection.query(
"INSERT INTO PoemRankings (poemStart, continuation, ranking) VALUES (?, ?, ?)",
[start, continuation, ranking],
error => {
if (error) {
    console.log("there was an error")
return res.send({ error });
}
res.send({ success: true });
console.log("we did it");
}
);
});

app.listen(3000, () => {
console.log("Server running on port 3000");
});