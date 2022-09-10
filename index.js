const express = require('express')
const dynamodb = require('dynamodb');
const Joi  = require('joi')
const bodyParser = require('body-parser')

const app = express()
const port = 3000 

dynamodb.AWS.config.update({  
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
});

const Event = dynamodb.define('Event', {
    hashKey : 'customer_id',
    rangeKey: 'id',
    timestamps: false,
  
    schema : {
      id            : dynamodb.types.uuid(),
      description   : Joi.string(),
      event_time    : Joi.date(),
      customer_id   : Joi.string(),
      type          : Joi.string(),
      details       : Joi.string(),
    }
});

async function saveEvent(data) {
    try {
        const event = new Event({...data, details: JSON.stringify(data.details)});
        return await event.save()
    } catch(err) {
        console.log('Failed to save Event', err);
        return undefined
    }
}

async function searchEvents(customerId, from, to) {
    try {
        const result =  await Event.scan()
            .where('customer_id').equals(customerId)
            .where('event_time').between(from, to)
            .exec()
            .promise()
        
        console.log(result)

        return [].concat.apply([], [...result]).flatMap((scan) => scan.Items)
    } catch(err) {
        console.log('Failed to search Events', err);
        return undefined
    }
}
  
app.use(function (req, res, next) {
    res.header("content-type",'application/json');
    next();
});

app.use(bodyParser.json())

app.get("/events/:customerId", async (req, res) => {
    // query param validation

    
    const events = await searchEvents(req.params.customerId, req.query.from, req.query.to)

    console.log(events)
    
    if (events == undefined) {
        res.status(500).send('{"error": "Failed to search events"}')
    }

    res.status(200).send(
        JSON.stringify({
            events: events.map((event) => {
                const details = event.attrs.details

                return {...event.attrs, details: JSON.parse(details)}
            })
        })
    )
})

app.post("/events", async (req, res) => {
    // validation

    const event = await saveEvent(req.body)

    if (event == undefined) {
        res.status(400).send('{"error": "Failed to persist event"}')
    } else {
        const details = event.attrs.details

        res.status(201).send(JSON.stringify({...event.attrs, details: JSON.parse(details)}))
    }
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