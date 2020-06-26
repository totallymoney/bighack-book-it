const messageFormatter = require('./utils/messageFormatter');
const database = require('./db/database');
const axios = require('axios').default;
const requestParser = require('./utils/requestParser');

module.exports.handle = async function(event, context) {
  console.log('Interaction Event has come', event);

  const parsedBody = requestParser.parseBody(event.body);
  const callback_id = parsedBody.view.callback_id;
  
  if(parsedBody.type === 'view_submission' && callback_id && callback_id.startsWith("newEventModal-"))
  {
    console.log('FORM SUBMISSION INTERACTION',parsedBody.type,parsedBody.view.callback_id)
    try{
      const values = parsedBody.view.state.values;
      const form = {};  

      Object.keys(values).forEach(p => {
        const fieldName = Object.keys( values[p] )[0];
        const fieldValue = values[p][fieldName];
        switch(fieldValue.type){
          case "datepicker": form[fieldName] = fieldValue.selected_date;break;
          case "plain_text_input": form[fieldName] = fieldValue.value; break;
          case "static_select": form[fieldName] = fieldValue.selected_option.value;break;
          default: form[fieldName] = 'unknown';
        }
      })

      // get event type
      const channel_name = callback_id.substring("newEventModal-".length);
      const eventTypeDetails = await database.getEventTypeByChannelName(channel_name);
      if(!eventTypeDetails) {
        console.log('CANNOT FIND EVENT TYPE FOR CHANNEL', channel_name);
      }

      //merging date into one field
      var hours = parseInt(form.event_time_hour);
      var minutes = parseInt(form.event_time_minutes);
      var eventDate = new Date(form.event_date);
      eventDate.setTime(eventDate.getTime() + (hours*60*60*1000) + (minutes*60*1000));

      const rq = {
        event_type: eventTypeDetails.id,
        description:  form.description,
        max_participants: form.max_participants,
        selection_period_days: form.selection_period_days,
        reminder_period_minutes: form.reminder_period_minutes,
        event_date: eventDate.toISOString(),
      }
      console.log("NEW EVENT REQUEST", rq);

      // we create new event
      await database.upsertEvent(rq);
      
      console.log('notify about new event',eventTypeDetails.channel_web_hook);
      // notify about new event
      try{
        await axios.post(eventTypeDetails.channel_web_hook, messageFormatter.newEventCreated(rq,eventTypeDetails))
      }
      catch(ex) {
        console.log('WEBHOOK PROBLEM:', ex.message)
      }
    }
    catch(ex) { 
      console.log('ERROR DURRNIG FORM PARSE', ex);
    }

    // remove all views (one in our case)
    return messageFormatter.httpWrapper(200, {
      "response_action": "clear"
    })
  }
  return messageFormatter.httpWrapper(200);
}