var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

//status van verkoop
var status = 1;

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

var messageText = message.text.toLowerCase();
var messageAttachments = message.attachments;
if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    if(messageText.includes('starten') && status == 1)
    {
      sendButtonMessageFestivals(senderID);
      status = 2;
    }
    if(messageText.includes('flow festival') && status == 2)
    {
      sendButtonMessageFlow(senderID);
      status = 3;
    }
    if(messageText.includes('help'))
    {
      sendButtonMessageHelp(senderID);
    }

}
}

function receivedPostback(event) {

  //PAYLOAD DATA
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var payload = event.postback.payload;

    if(payload == 'GET_STARTED' && status == 1)
    {
      sendButtonMessageStart(senderID);
    }
    if(payload == "PAYLOAD_FLOW_FESTIVAL" && status == 2)
    {
      sendButtonMessageFlow(senderID);
    }

    if(payload == 'PAYLOAD_HELP')
    {
      sendButtonMessageHelp(senderID);
    }
    /*switch(payload)
    {
        case 'GET_STARTED':
            sendButtonMessageStart(senderID);
            break;

        case 'PAYLOAD_FESTIVALS':
            sendButtonMessageFestivals(senderID);
            break;

        case 'PAYLOAD_FLOW_FESTIVAL':
            sendButtonMessageFlow(senderID);
            break;

        case 'PAYLOAD_DANCETOUR':
            var msg="Dancetour Breda is helaas uitverkocht.";
            sendTextMessage(senderID,msg);
            break;

        case 'PAYLOAD_TOPPERS':
            var msg="De Toppers zijn helaas uitverkocht.";
            sendTextMessage(senderID,msg);
            break;

        case 'PAYLOAD_HELP':
            var msg ="Druk op de knop festivals om een lijst met festivals te krijgen. Druk op de knop stoppen om het gesprek te stoppen.";

            sendTextMessage(senderID,msg);
            break;

        case 'PAYLOAD_STOPPEN':
            var msg ="Jammer dat je wilt stoppen met chatten. Graag tot de volgende keer!";

            sendTextMessage(senderID,msg);
            break;

            case 'PAYLOAD_REGULIER':
                sendButtonMessageRegulier(senderID);
                break;

            case 'PAYLOAD_VIP':
                var msg ="VIP kaarten zijn helaas uitverkocht!";

                sendTextMessage(senderID,msg);
                break;

            case 'PAYLOAD_EARLY_BIRD':
                var msg ="Early-bird kaarten zijn helaas uitverkocht!";

                sendTextMessage(senderID,msg);
                break;

        default :
            var msg = "hier komt nog logica.";
            sendTextMessage(senderID,msg);
        break;

    }*/

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
          text: "He, leuk dat je contact met me opneemt! Ik ben een bot en kan je helpen met het bestellen van kaarten. Laat me weten welk festival je wilt bezoeken en ik zal je helpen! Niet zeker wat je moet doen? Type help of druk op de knop voor een uitleg.",
          buttons:[{
            type: "postback",
            title: "Help mij",
            payload: "PAYLOAD_HELP"

          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}


function sendButtonMessageHelp(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Je hebt dus mijn hulp nodig? Geen probleem! Ik kan je helpen bij het kopen van kaarten voor aankomende festivals. Door simpel weg te zeggen naar welk festival je wilt zal ik je verdere vragen stellen om speciaal voor jou de geschikte kaarten te vinden. Om te beginnen kan je bijvoorbeeld zeggen 'Ik wil graag kaarten kopen voor Flow festival'. Ook kan je op één van de knoppen drukken.",
          buttons:[{
            type: "postback",
            title: "Aankomende Festivals",
            payload: "PAYLOAD_AANKOMEND"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function sendButtonMessageFlow(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Je wilt dus kaarten kopen voor Flow Festival. Wil je Early-bird, Regulier of VIP kaarten kopen voor Flow Festival?",
          buttons:[{
            type: "postback",
            title: "Early-bird",
            payload: "PAYLOAD_EARLY_BIRD"
          }, {
            type: "postback",
            title: "Regulier",
            payload: "PAYLOAD_REGULIER"
          }, {
            type: "postback",
            title: "VIP",
            payload: "PAYLOAD_VIP"
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}


function sendButtonMessageRegulier(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Hoeveel regulieren kaarten wil je kopen?",
          buttons:[{
            type: "postback",
            title: "1",
            payload: "PAYLOAD_"
          }, {
            type: "postback",
            title: "2",
            payload: "PAYLOAD_2"
          }, {
            type: "postback",
            title: "3",
            payload: "PAYLOAD_3"
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
