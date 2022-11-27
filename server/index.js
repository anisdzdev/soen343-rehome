const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
const fs = require("fs");
const csv  = require("fast-csv");

const users = {};

fs.createReadStream("./data/users.csv")
    .pipe(csv.parse({ headers: true }))
    .on("data", function (row) {
        users[row.email] = row.password;
    })
    .on("end", function () {
        console.log("finished loading users");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(users[email] !== password) return res.status(401).send('Invalid username or password.');
    res.send("Login successful!");
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));