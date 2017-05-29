var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook', function (req, res) {
var data = req.body;

// Make sure this is a page subscription
if (data.object === 'page') {


    data.entry.forEach(function(entry) {
    var pageID = entry.id;
    var timeOfEvent = entry.time;

    entry.messaging.forEach(function(event) {
        if (event.message) {

        receivedMessage(event);

        } else {

        if(event.postback)
        {
            receivedPostback(event);
        }

        }
    });
    });

    // You should return a 200 status code to Facebook
    res.sendStatus(200);
}
});

var token = "EAAcDZBHcmgBgBAPNOxOdPjElhIx2tZCdTekxRhiGVffM5Ueb5eQZCWOnOeaHEPhtvXRJ3hSUi60mK6aKcVxy8s4s7HbZC3kqdLi8OwwUmJKBqiVBIBMeVVZAax8grfznxXdstqf3ybeJ3dpZArXLDU9kZBqAOppjgxFT3QUdDgiwAZDZD"

function receivedMessage(event) {
var senderID = event.sender.id;
var recipientID = event.recipient.id;
var timeOfMessage = event.timestamp;
var message = event.message;

var messageId = message.mid;

var messageText = message.text;
var messageAttachments = message.attachments;
if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
    case 'help' :
        var msg = "Via mij kan je kaarten kopen voor festivals. Type festivals en ik zal je een lijst geven met aankomende festivals.";
        sendTextMessage(senderID,msg);
        break;

    case 'flow festival' :
        var msg = "Je wilt dus kaarten kopen voor Flow festival. Wil je VIP of regulieren kaarten?";
        //sendTextMessage(senderID,msg);
        sendButtonMessage(senderID);
        break;

    case 'VIP' :
        var msg = "Je wilt dus VIP tickets. Hoeveel kaarten wil je kopen?";
        sendTextMessage(senderID,msg);
        break;

    case 'regulier' :
          var msg = "Je wilt dus regulieren tickets. Hoeveel kaarten wil je kopen?";
          sendTextMessage(senderID,msg);
          break;

    case 'festivals' :
        var msg = "flow festival, Dancetour, Harmony of hardcore, The road to graauwrock.";
        sendTextMessage(senderID,msg);
        break;

    default :
        sendTextMessage(senderID,"Dat begreep ik niet helemaal... type help als je me hulp nodig heb.");
    break;
    }
}
}

function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var payload = event.postback.payload;
    switch(payload)
    {
        case 'GET_STARTED':

            sendButtonMessageStart(senderID);
            break;
        case 'PAYLOAD_HELP':
            var msg ="Je hebt dus me hulp nodig... Druk op de knop festivals om een festival te selecteren. Druk op de knop stoppen om met het gesprek te stoppen.";

            sendTextMessage(senderID,msg);
            break;

        case 'PAYLOAD_FESTIVALS':

            sendButtonMessageFestivals(senderID);
            break;

        case 'PAYLOAD_KELTFEST':

            sendButtonMessageKelt(senderID);
            break;

        case 'PAYLOAD_FLOW_FESTIVAL':

            sendButtonMessageFlow(senderID);
            break;
        default :
            var msg = "hier komt nog logica.";
            sendTextMessage(senderID,msg);
        break;
    }

}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
        id: recipientId
        },
        message: {
        text: messageText
        }
    };
    // call the send API
    callSendAPI(messageData);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessageStart(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Hallo, ik ben een bot! Via mij kan je kaarten kopen. Druk op een van de aangegeven opties hieronder om door te gaan.",
          buttons:[{
            type: "postback",
            title: "Festivals",
            payload: "PAYLOAD_FESTIVALS"
          }, {
            type: "postback",
            title: "Help",
            payload: "PAYLOAD_HELP"
          }, {
            type: "postback",
            title: "Stoppen",
            payload: "PAYLOAD_STOPPEN"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

//Button template for different festivals.

function sendButtonMessageFestivals(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Kies een van de onderstaande festivals.",
          buttons:[{
            type: "postback",
            title: "Keltfest",
            payload: "PAYLOAD_KELTFEST"
          }, {
            type: "postback",
            title: "Flow Festival",
            payload: "PAYLOAD_FLOW_FESTIVAL"
          }
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;
        //successfull

        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
