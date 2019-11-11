const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
/*
    400 = Bad Request
    200 = Okay
    404 = Request cannot be found
    500 = Internal Server Error
*/
// controllers
const user = require('./controllers/users');
const events = require('./controllers/events');
const busytime = require('./controllers/busytime');
const invitees = require('./controllers/invitees');
const poll = require('./controllers/poll');
// initialization
const app = express();
const port = 3000;

// engine
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// user router
user.router.get('/login/:user_id',user.getUser);
user.router.get('/test',user.test)
user.router.post('/register',user.postUser);

// events router
events.router.get('/:user_id',events.getEvents)
events.router.post('/insert',events.postEvents)

// busytime router
busytime.router.get('/:user_id',busytime.getBusyTime)
busytime.router.post('/insert',busytime.postBusyTime)

// invitees router
invitees.router.get('/get/:event_id',invitees.getInvitees);
invitees.router.post('/insert',invitees.postInsertInvitees);
invitees.router.put('/put',invitees.putUpdateInvitees)

// poll router
poll.router.post('/insert',poll.postInsertPolls)

// add the router to the app
app.use("/user",user.router);
app.use("/events",events.router);
app.use("/busytime",busytime.router);
app.use("/invite",invitees.router);
app.use("/poll",poll.router);

app.listen(port,()=>{
    console.log(`listening to ${port}`)
})
