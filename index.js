const express = require('express')
const dynamodb = require('dynamodb');
const Joi  = require('joi')

const app = express()
const port = 3000 

dynamodb.AWS.config.update({  
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
});

const Event = dynamodb.define('Event', {
    hashKey : 'id',
  
    schema : {
      id            : dynamodb.types.uuid(),
      description   : Joi.string(),
      event_time    : Joi.date(),
      customer_id   : Joi.string(),
      type          : Joi.string(),
      details       : Joi.string(),
    }
});
  
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
    dynamodb.createTables(function(err) {
        if (err) {
          console.log('Terminal Application Error. Could not create DynamoDb tables: ', err);
          process.exit() 
        } else {
          console.log('Tables have been created');
          console.log(`Events app listening on port ${port}`)
        }
    });
})