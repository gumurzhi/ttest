---
title: "deal service REST API"

service use basicAuth

POST /register - public

expects:  JSON
{
    "firstname": "name",
    "lastname": "surename",
    "email": "a@mail.ua",
    "password": "myStrongPassword"
}
-will create new user

POST /message/:recipientId  - private

expects:  JSON
{
    "text": "Hello world",
     "price": 23,
}

will create new deal and first message belonged to this deal

POST /message/:recipientId/:dealId

 expects:  JSON
 {
     "text": "Hello world",
      "price": 23,
 }

 will create new message belonged to existing deal
