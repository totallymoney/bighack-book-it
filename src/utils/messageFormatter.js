const moment = require('moment-timezone');

const httpWrapper = (statusCode, message) => {
    return {
        statusCode: statusCode,
        body: message && JSON.stringify(message)
      }
}

const removeFromWaitingList = (eventTitle) => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:white_check_mark: You've been successfully removed from the waiting list for ${eventTitle}`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const removeFromWaitingListWithPenatly = (eventTitle) => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:white_check_mark: You've been successfully removed from the waiting list for ${eventTitle}.`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:warning: Penalty for late resignation applied.`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const removeFromWaitingListNotSignedUp = (eventTitle) => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:no_entry_sign: You were not signed up for the waiting list for ${eventTitle}.`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:information_source: Sign up for waiting list with \`/in\` command.`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const cannotFindEventForChannel = () => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:warning: Cannot determine the event.`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:information_source: Please ensure you are in the event channel before signin in or out.`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const noActiveEventForEventType = (eventTitle, channelName) => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:warning: No event has been announced for ${eventTitle} event yet.`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:information_source: Visit channel #${channelName} for next events announcements.`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const alreadySignedUpForEvent = (eventTitle) => {
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:ghost: You are already on the waitnig list for ${eventTitle} event.`
                }
            },
            {
                type: "divider"
            }
        ]
    })
}
const newEventCreated = (event, eventType) => {
    let selectionDate = new Date(event.event_date);
    selectionDate.setDate(selectionDate.getDate() - event.selection_period_days);
    
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `@here \n :soccer: :mega: A new ${eventType.title} event has been created:`
                },
                accessory:{
                    type: "image",
                    image_url: `${eventType.image_url}#${new Date()}`,
                    alt_text: `${eventType.title}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Details:* ${event.description}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Event Date:* ${moment.tz(event.event_date, 'Europe/London')}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Max Participants:* ${event.max_participants}`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Sign-up Deadline:* ${moment.tz(selectionDate, 'Europe/London')}`
                },
            },
            {
                type: "divider",
                
            }
        ]
    }

    
}
const peopleWereSelected = (event, eventType) => {
    const participants = event.participants.slice(0,event.max_participants);
    const reserves = event.participants.slice(event.max_participants);

    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:mega: The list of participants for ${eventType.title}:`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":page_facing_up: *Starting Line-up*"
                }

            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: participants.length > 0 ?  "* @" + participants.join(`\n * @`) : "no one!"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":double_vertical_bar: *Subs (Bring your kit just in case)*"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: reserves.length > 0 ?  "* @" + reserves.join(`\n * `) : "no one!"
                }
            },
            {
                type: "divider"
            },
        ]
    };
}
const eventClosing = (event, eventType) => {
    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:checkered_flag: ${eventType.title} is closed now. Thank you for attending.`
                }
            },
            {
                type: "divider"
            },
        ]
    };
}
const eventStartsSoon = (event, eventType) => {
    const participants = event.participants.slice(0,event.max_participants);
    const reserves = event.participants.slice(event.max_participants);

    return {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:soccer: :mega: Reminder! ${eventType.title} starts in less than ${event.reminder_period_minutes} minutes (${moment.tz(event.event_date, "Europe/London").format('ha')}).`
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":page_facing_up: *Starting Line-up*"
                }

            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: participants.length > 0 ?  "* @" + participants.join(`\n * @`) : "no one!"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: ":double_vertical_bar: *Subs (Bring your kit just in case)*"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: reserves.length > 0 ?  "* @" + reserves.join(`\n * `) : "no one!"
                }
            },
            {
                type: "divider"
            },
            

        ]
    }
}
const successfullySignedUpForEvent = (eventType, event) => {
    let selectionDate = new Date(event.event_date);
    selectionDate.setDate(selectionDate.getDate() - event.selection_period_days);
    
    return httpWrapper(200, {
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `:white_check_mark: You are now on the waitnig list for ${eventType.title}! 
                        \n :stableparrot: Event will take place on ${moment.tz(event.event_date, 'Europe/London')}
                        \n :mega: Final places will be announced *${moment.tz(selectionDate, 'Europe/London')}*
                        \n :no_entry_sign: *If you can no longer play*, please cancel *before announcement date*`
                },
                accessory:{
                    type: "image",
                    image_url: `${eventType.image_url}#${new Date()}`,
                    alt_text: `${eventType.title}`
                }
            },
            {
                type: "divider"
            },
        ]
    })
}
const eventCreationConfirmation = (event, eventType) => {
    return httpWrapper(200, {
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": "New Event Has Been Created",
                    "emoji": true
                }
            },
            {
                type: "divider"
            },
        ]
    })
}

const getOptions = (values) => {
    return values.map(v => {
        v = v.toString();
        return {
            "text": {
                "type": "plain_text",
                "text": v,
                "emoji": true
            },
            "value": v
        }
    });
}
const newEventForm = (eventType) => {
     
    return {
        "title": {
            "type": "plain_text",
            "text": eventType.title || "NEW FORM",
        },
        "submit": {
            "type": "plain_text",
            "text": "Create Event"
        },
        "blocks": [
            {
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "description",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Enter event name here"
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "event name"
                },
            },
            {
                "type": "input",
                "element": {
                    "type": "datepicker",
                    "action_id": "event_date",
                    "initial_date": new Date().toISOString().substring(0,10),
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Event Date",
                        "emoji": true
                    }
                },
                "label": {
                    "type": "plain_text",
                    "text": "Event Date",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "action_id": "event_time_hour",
                    "placeholder": {
                        "type": "plain_text",

                        "text": "Select an hour",
                        "emoji": true
                    },
                    "options": getOptions([6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
                },
                "label": {
                    "type": "plain_text",
                    "text": "Event hour",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "action_id": "event_time_minutes",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select minutes",
                        "emoji": true
                    },
                    "options": getOptions([0,5,10,15,20,25,30,35,40,45,50,55])
                },
                "label": {
                    "type": "plain_text",
                    "text": "Event minutes",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "action_id": "max_participants",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select max number of participants",
                        "emoji": true
                    },
                    "options": getOptions([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,40,50,60,70,80,90,100,1000])
                },
                "label": {
                    "type": "plain_text",
                    "text": "Max participants",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "action_id": "reminder_period_minutes",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select minutes before event",
                        "emoji": true
                    },
                    "options": getOptions([5,10,15,20,25,30,45,60,90])
                },
                "label": {
                    "type": "plain_text",
                    "text": "Event reminder",
                    "emoji": true
                }
            },
            {
                "type": "input",
                "element": {
                    "type": "static_select",
                    "action_id": "selection_period_days",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select days before event",
                        "emoji": true
                    },
                    "options": getOptions([1,2,3,4,5,6,7])
                },
                "label": {
                    "type": "plain_text",
                    "text": "Selection moment (penatlies for late sub/unsub after)",
                    "emoji": true
                }
            },
            
        ],
        "type": "modal",
        "callback_id": "newEventModal-" + eventType.channel_name,
    }

}
module.exports = {
    newEventForm,
    eventCreationConfirmation,
    removeFromWaitingList,
    removeFromWaitingListWithPenatly,
    removeFromWaitingListNotSignedUp,
    cannotFindEventForChannel,
    noActiveEventForEventType,
    alreadySignedUpForEvent,
    successfullySignedUpForEvent,
    peopleWereSelected,
    eventStartsSoon,
    newEventCreated,
    eventClosing,
    httpWrapper,
}