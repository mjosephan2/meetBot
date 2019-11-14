var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();
exports.getEvents = function (req, res, next) {
    // get events created by a certain user
    var cond = "user_id = '" + req.params.user_id + "'";
    console.log(req.query)
    cond+=common.addQueryCond(req.query)
    console.log(cond)
    _getData("*", cond)
        .then(function (data) {
        res.status(200).send(data);
    })
    .catch((err)=> {
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({events:"not found"}))
    })
};

exports.getInvitedEvents = function(req,res,next){
    // get events created by a certain user
    const user_id = req.params.user_id
    const mySQLCommand = `select e.* from events e
    left join invitees i on i.user_id = ${user_id}
    where i.event_id = e.event_id`
    init.pool.query(mySQLCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({events:"not found"}))
        }
        res.status(200).send(rs);
    })
}
exports.postEvents = function(req,res, next){
    const eventdet = req.body
    console.log(eventdet)
    common.insertGenericData('Events', SQLconfig.events_table, eventdet)
    .then(function(data){
        res.status(200).send(data)
    })
    .catch(function(err){
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.status(404).send(JSON.stringify({error:err.sqlMessage}))
    })
}
exports.putUpdateEvents = function(req,res,next){
    // add constrain later, e.g cannot change event_id and etc
    // event_id:"",data:{}
    console.log(req.body)
    const event_id = req.body.event_id;
    const values = req.body.data;
    var sqlCommand = "UPDATE events SET ? WHERE event_id=?"
    init.pool.query(sqlCommand,[values,event_id],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Update")
        }
        res.status(200).send(rs)
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('Events', SQLconfig.events_table, params, cond);
};