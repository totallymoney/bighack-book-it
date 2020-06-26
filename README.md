# bighack-book-it
Booking system for our internal events 

APP 'book-it' is installed in TotallyMoney Slack Account. It allows you to book any event that requires waiting list and bigger group of people. 

This app needs to perform the following steps to add to your slack group: 
1. Create app in your slack (you can name it `book-it`)
2. add 3 SSM parameters to your AWS account: 
 - prod-BookItSlackBotToken - you can find it in you slack app's 'OAuth & Permissions' page. It starts with 'xoxb-XXXXXXXX...'
 - prod-BookItSlackClientId - you can find it in you slack app's 'Basic Informaton' page.
 - prod-BookItSlackClientSecret - you can find it in you slack app's 'Basic Informaton' page.
3. deploy the service to your AWS account (sls deploy --profile <your AWS profle> --stage prod
 this will create some lambdas in your account plus two dynamodb tables
4. setup 3 slash commands in you slack app: 
 - `/new-event` - map it to newEventForm lambda url (eg https://XXXX.execute-api.eu-west-2.amazonaws.com/stage/new-event)
 - `/in`  - mapped to signUpForEvent lambda (eg https://XXXXX.execute-api.eu-west-2.amazonaws.com/stage/sign-up)
 - `/out` - mapped to resignFromEvent lambda (eg. https://XXXX.execute-api.eu-west-2.amazonaws.com/stage/resign)
5. setup Interactivity ON with request to appInteraction lambda (eg. https://XXXX.execute-api.eu-west-2.amazonaws.com/stage/message)
6. create slack channel for the event (eg. football-channel)
7. setup Incomming Webhooks in your slack app for the event channel
8. go to DynamoDb in your AWS account and add new event in prod-BigHack-Book-It-EventTypes table: 
 {
  "channel_name": "football-channel",
  "channel_web_hook": "https://hooks.slack.com/services/<SOME ID>/<SOME ID>/<SOME ID>", <- this is webhook to football-channel
  "description": "Weekly football event",
  "id": "football",
  "image_url": "https://source.unsplash.com/featured/?soccer,team,goal",
  "team_domain": "<your channel name>",
  "title": "TM Football"
} 
9. you can repeat steps 6,7,8 for any number of event types you like - yoga , badminton etc - anything with limited number of spaces/seats

YOU ARE READY DO GO!

then when you enter #football-channel, you can perform slash commands: 
/new-event - will pop up new event form where you can enter event's details (only one event of the same kind at once can be active)
/in - you will join the event
/out - you will resign from the event leaving your place to someone else

TODO: 
- FIX TIMES. ENSURE EVERYTHING WORKS IN GMT. 
- OPTIONALLY - MOVE EVENT CREATION FORM FROM ZAPIER TO SLACK SO IT'S EASIER TO USE
- SECURTY CONCERNS
- ADD FUNCTIONALITY TO BOOK INDIVIDUAL TIME SLOTS , LIKE FOR MESSAGE : `/in 1,2,5 , where 1,2,5 represents numbers of slots you are free for. Then the picking algorithm would choose the best list of people ensuring the most places are taken and most people are happy :) 


deployment : sls deploy 
will deploy stage version to `tmhackday` aws profile from your computer.
