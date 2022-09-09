const express = require('express')

const app = express()
const port = 3000 

app.use(function (req, res, next) {
    res.header("content-type",'application/json');
    next();
});

app.get("/events", (req, res) => {
    res.status(200).send('{"message": "This will return events"}')
})

app.post("/events", (req, res) => {
    res.status(200).send('{"message": "This will save events"}')
})

app.listen(port, () => {
    console.log(`Events app listening on port ${port}`)
})