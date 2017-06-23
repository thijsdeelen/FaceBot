var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

//globale vars
var first_name;
var last_name;

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

var token = "EAAcDZBHcmgBgBAPNOxOdPjElhIx2tZCdTekxRhiGVffM5Ueb5eQZCWOnOeaHEPhtvXRJ3hSUi60mK6aKcVxy8s4s7HbZC3kqdLi8OwwUmJKBqiVBIBMeVVZAax8grfznxXdstqf3ybeJ3dpZArXLDU9kZBqAOppjgxFT3QUdDgiwAZDZD";

function receivedMessage(event) {
var senderID = event.sender.id.toString();
var recipientID = event.recipient.id.toString();
var timeOfMessage = event.timestamp;
var message = event.message;

var messageId = message.mid;

var messageText = message.text.toLowerCase();
var messageAttachments = message.attachments;
if (messageText) {

      if(messageText.includes('aankomend') && messageText.includes('festival'))
      {
        sendButtonMessageAankomend(senderID);
      }
      if(messageText.includes('flow festival'))
      {
        sendButtonMessageFlow(senderID);
      }
      if(messageText.includes('help'))
      {
        sendButtonMessageHelp(senderID);
      }
      if(messageText.includes('regulier'))
      {
        sendButtonMessageRegulier(senderID);
      }
      if(messageText.includes('vip'))
      {
        sendButtonMessageVIP(senderID);
      }

    //Als de gebruiker wilt stoppen of een ander festival wilt kiezen kan dit via stoppen.
    // Zet de status terug op begin zodat gebruiker opnieuw kan beginnen.
    if(messageText.includes('stoppen'))
    {
      sendButtonMessageStoppen(senderID);
    }
}
}

function receivedPostback(event) {

  //PAYLOAD DATA
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var payload = event.postback.payload;

    if(payload == 'GET_STARTED')
    {
      getName(senderID, token);
      sendButtonMessageStart(senderID)
    }
    else if(payload == 'PAYLOAD_FLOW_FESTIVAL')
    {
      sendButtonMessageFlow(senderID);
    }

    // Uitleg hoe je de bot kan gebruiken naar gebruiker.
    else if(payload == 'PAYLOAD_HELP')
    {
      sendButtonMessageHelp(senderID);
    }

    // Een lijst met aankomende festivals.
    else if(payload == 'PAYLOAD_AANKOMEND')
    {
      sendButtonMessageAankomend(senderID);
    }

    else if(payload == 'PAYLOAD_REGULIER')
    {
      sendButtonMessageRegulier(senderID);
    }

    else if(payload == 'PAYLOAD_REGULIER_TICKET')
    {
      sendButtonMessageSendTicket(senderID);
    }

    else if(payload == 'PAYLOAD_STOPPEN')
    {
      sendButtonMessageStoppen(senderID);

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
          text: "He "+ first_name +" "+ last_name +", leuk dat je contact met me opneemt! Ik ben een bot en kan je helpen met het bestellen van kaarten. Laat me weten welk festival je wilt bezoeken en ik zal je helpen! Niet zeker wat je moet doen? Type help of druk op de knop voor een uitleg.",
          buttons:[{
            type: "postback",
            title: "Help mij",
            payload: "PAYLOAD_HELP"

          },
          {
            type: "postback",
            title: "Aankomende festivals",
            payload: "PAYLOAD_AANKOMEND"

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

function sendButtonMessageAankomend(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Er zijn weer genoeg festivals in aantocht. Hierbij een lijst met aankomende festivals.",
          buttons:[{
            type: "postback",
            title: "Flow Festival",
            payload: "PAYLOAD_FLOW_FESTIVAL"
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
          text: "Regulieren kaarten voor Flow festival. Prima keuze. Hoeveel kaarten zou je willen bestellen. Het maximaal aantal kaarten dat je tegelijkertijd kan kopen is 1.",
          buttons:[{
            type: "postback",
            title: "1",
            payload: "PAYLOAD_REGULIER_TICKET"

          }]
        }
      }
    }
  };

    callSendAPI(messageData);
  }

  function sendButtonMessageVIP(recipientID) {
    var messageData = {
      recipient: {
        id: recipientID
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "VIP kaarten voor Flow festival. Prima keuze. Hoeveel kaarten zou je willen bestellen. Het maximaal aantal kaarten dat je tegelijkertijd kan kopen is 1.",
            buttons:[{
              type: "postback",
              title: "1",
              payload: "PAYLOAD_VIP_TICKET"

            }]
          }
        }
      }
    };

      callSendAPI(messageData);
    }

  function sendButtonMessageSendTicket(recipientID) {
    var messageData = {
      recipient: {
        id: recipientID
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Regulieren kaarten voor Flow festival. Prima keuze. Hoeveel kaarten zou je willen bestellen. Het maximaal aantal kaarten dat je tegelijkertijd kan kopen is 5.",
            buttons:[{
              type: "web_url",
              url: "http://cmgo.to/iT3ZiYi",
              title: "Tickets"

            }]
          }
        }
      }
    };

      callSendAPI(messageData);
    }

function sendButtonMessageStoppen(recipientID) {
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Jammer dat je niet verder wilt gaan. Wil je alsnog kaarten bestellen voor een festival. Roep dan simpel weg waar je naar toe wilt en ik zal je helpen!",
          buttons:[{
            type: "postback",
            title: "Aankomende festivals",
            payload: "PAYLOAD_AANKOMEND"
          }, {
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
          text: "Je wilt dus naar Flow Festival 2017? Goeie keuze! Voor dit festival zijn 2 soorten kaarten beschikbaar. VIP & Regulier. Welke variant wil je aanschaffen?",
          buttons:[{
            type: "postback",
            title: "Reguliere tickets",
            payload: "PAYLOAD_REGULIER"
          }, {
            type: "postback",
            title: "VIP tickets",
            payload: "PAYLOAD_VIP"
          }, {
            type: "postback",
            title: "stoppen",
            payload: "PAYLOAD_STOPPEN"
          }]
        }
      }
    }
  };

    callSendAPI(messageData);
  }

function getName(senderID, token)
{

  const options = {
    url: 'https://graph.facebook.com/v2.6/'+ senderID +'?fields=first_name,last_name&access_token=' + token,
    method: 'GET',
    headers: {}
    };

    request(options, function(err, res, body)
    {
        var json = JSON.parse(body);
        first_name = json.first_name;
        last_name = json.last_name;
        console.log(json);
    });


    return first_name, last_name;
};

function callSendAPI(messageData) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
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
