var express = require('express');
var app = express();

app.listen((process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send("Deployed!");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "ditismijntoken123") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});
