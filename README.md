Endpoints

/events/customerId
get events
Query Parameters, to, from, ISO Timestamps
    {
        events: [
            {
                "id": "uuid"
                "description": "world",
                "event_time": "2000-10-31T01:30:00.000-05:00",
                "customer_id": "1234",
                "type": "Event",
                "details": {
                    "field1": "xyz",
                    "many": [
                        {
                            "sub_item": "1"
                        },
                        {
                            "sub_item": "2"
                        }
                    ]
                }
            },
            ......
        ]
    }

/events
Post Events
    {
        "description": "world",
        "event_time": "2000-10-31T01:30:00.000-05:00",
        "customer_id": "1234",
        "type": "Event",
        "details": {
            "field1": "xyz",
            "many": [
                {
                    "sub_item": "1"
                },
                {
                    "sub_item": "2"
                }
            ]
        }
    }

To Run

docker-compose build
docker-compose up

To Test

Curl:

1. Empty list:

   localhost:3000/events/1234?to=2000-19-31T01:30:00.000Z&from=2000-09-31T01:30:00.000Z

2. Add Event
