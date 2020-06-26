const axios = require('axios').default;
const database = require('./db/database');
const participantsSorter = require('./utils/participantsSorter');
const messageFormatter = require('./utils/messageFormatter');
const timeHelper = require('./utils/timeHelper');

module.exports.handle = async function (event) {
    console.log('Notification / Scheduler Event', event);
       
    const allEventTypes = await database.getAllEventTypes();
    for(var i = 0 ; i < allEventTypes.length; i++) {
        const eventType = allEventTypes[i];
        const allEvents = await database.getAllEvents(eventType.id);
        const activeEvent = allEvents.find(e => e.status !== 'FINISHED');
        if(activeEvent) {
            console.log('CHECKINIG EVENT ', activeEvent);
            if(activeEvent.status === 'NEW') {
                const selectionDate = new Date(activeEvent.event_date);
                selectionDate.setDate(selectionDate.getDate() - activeEvent.selection_period_days);
                if(new Date() > selectionDate) {
                    console.log('CHANGING EVENT NEW => SELECTED', activeEvent);
            
                    activeEvent.status = 'SELECTED';
                    activeEvent.participants = [...participantsSorter.sortParticipants(activeEvent,allEvents) ]
                    await database.upsertEvent(activeEvent);
                    const msg = messageFormatter.peopleWereSelected(activeEvent,eventType);
                    console.log('SELECTED MSG', JSON.stringify(msg))
                    await axios.post(eventType.channel_web_hook, msg)
                }
            
            }

            if(activeEvent.status === 'SELECTED') {
                const reminderDate = timeHelper.addMinutes(new Date(activeEvent.event_date),-activeEvent.reminder_period_minutes-5);
                console.log('REMINDER DATE', reminderDate);
                console.log('CURRENT DATE',  new Date());
                if(new Date() > reminderDate) {
                    console.log('CHANGING EVENT SELECTED => REMINDED', activeEvent);

                    activeEvent.status = 'REMINDED';
                    activeEvent.participants = [...participantsSorter.sortParticipants(activeEvent,allEvents) ]
                    await database.upsertEvent(activeEvent);
                    await axios.post(eventType.channel_web_hook, 
                        messageFormatter.eventStartsSoon(activeEvent,eventType)
                    )
                }
            }

            if(activeEvent.status === 'REMINDED') {
                const eventEndDate = timeHelper.addHours(new Date(activeEvent.event_date),2);
                console.log('CLOSING DATE', eventEndDate);
                console.log('CURRENT DATE',  new Date());
                console.log('EVENT DATE',  new Date(activeEvent.event_date));
                
                if(new Date() > eventEndDate) {
                    console.log('CHANGING EVENT REMINDED => FINISHED', activeEvent);

                    activeEvent.status = 'FINISHED';
                    activeEvent.participants = [...participantsSorter.sortParticipants(activeEvent,allEvents) ]
                    const msg = messageFormatter.eventClosing(activeEvent,eventType);
                    console.log('FINISHED MSG', JSON.stringify(msg));
                    await database.upsertEvent(activeEvent);
                    await axios.post(eventType.channel_web_hook, 
                        messageFormatter.eventClosing(activeEvent,eventType)
                    )
                }
            }
        }
    };
    return {
        statusCode: 200,
        body: JSON.stringify({status: 'OK'})
    }
}