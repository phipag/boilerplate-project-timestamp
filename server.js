// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

const preprocessDateString = (req, res, next) => {
    const rawDateString = req.params.date_string;
    let preprocessedDateString;
    if (!rawDateString) {
        preprocessedDateString = new Date();
    } else if (!isNaN(parseInt(rawDateString, 10))) {
        preprocessedDateString = new Date(parseInt(rawDateString, 10));
    } else {
        preprocessedDateString = rawDateString;
    }
    req.params.date_string = preprocessedDateString;

    next();
};

app.get('/api/timestamp/:date_string?', preprocessDateString, (req, res) => {
    try {
        const parsedDate = new Date(req.params.date_string);
        return res.status(200).json({
            unix: parsedDate.getTime(),
            utc: parsedDate.toUTCString()
        });
    } catch (e) {
        return res.status(422).send({ error: 'Invalid Date' });
    }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
