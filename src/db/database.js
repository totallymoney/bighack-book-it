const aws = require('aws-sdk');
const uuid = require('uuidv4').uuid;
const dynamoDb = new aws.DynamoDB.DocumentClient();
const EVENTS_TABLE = process.env.EVENTS_TABLE;
const EVENT_TYPES_TABLE =process.env.EVENT_TYPES_TABLE;

const getEventType = async function(event_type) {
    const params = {
        TableName: EVENT_TYPES_TABLE,
        Key: { id: event_type },
      };
    const result = await dynamoDb.get(params).promise()
    return result.Item || null;
}

const getAllEventTypes = async function() {
    const params = {
        TableName: EVENT_TYPES_TABLE,
      };
    const result = await dynamoDb.scan(params).promise()
    return result.Items;
}


const getEventTypeByChannelName = async (channel_name) => {
    const params = {
        TableName: EVENT_TYPES_TABLE,
        FilterExpression: '#channel_name = :channel_name',
        ExpressionAttributeNames: {
            "#channel_name": "channel_name"
        },
        ExpressionAttributeValues: {
            ':channel_name': channel_name
        },
    };

    const result = await dynamoDb.scan(params).promise();
    if(result.Items.length === 1) return result.Items[0];
    return null;
}

const getActiveEvent = async (event_type) => {
    const params = {
        TableName: EVENTS_TABLE,
        FilterExpression: '#event_type = :event_type AND #status <> :status',
        ExpressionAttributeNames: {
            "#event_type": "event_type",
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':event_type': event_type,
            ':status':'FINISHED',
        },
    };

    const result = await dynamoDb.scan(params).promise();
    if(result.Items.length === 1) return result.Items[0];
    return null;
        
}


const getAllEvents = async (event_type) => {
    const params = {
        TableName: EVENTS_TABLE,
        FilterExpression: '#event_type = :event_type',
        ExpressionAttributeNames: {
            "#event_type": "event_type"
        },
        ExpressionAttributeValues: {
            ':event_type': event_type
        },
    };

    const result = await dynamoDb.scan(params).promise();
    return result.Items;
}

const upsertEvent = async (event) => {
    const rq = {
        ...event,
        id: event.id || uuid(),
        status: event.status || 'NEW', 
        participants: event.participants || [],
        penalties_for_resignation: event.penalties_for_resignation || []
      }
    await dynamoDb.put({ TableName: EVENTS_TABLE, Item: rq }).promise();
    return rq;
}

module.exports = {
    getEventType,
    getAllEventTypes,
    getEventTypeByChannelName,
    getActiveEvent,
    getAllEvents,
    upsertEvent
}
