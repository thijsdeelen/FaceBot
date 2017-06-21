var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

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
