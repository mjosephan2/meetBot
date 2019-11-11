var common = require("./common");
var express = require("express");
var init = require('./init')
var cfg = require('../config/development.json');

exports.router = express.Router();
exports.getEvents = function (req, res, next) {
    var cond = "user_id = '" + req.params.user_id + "'";
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

exports.postEvents = function(req,res, next){
    const eventdet = req.body
    console.log(eventdet)
    common.insertGenericData('Events', cfg.db_details.events_table, eventdet)
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
    const event_id = req.body.user_id;
    const values = req.body.data;
    var sqlCommand = "UPDATE invitees SET ? WHERE event_id=?"
    init.pool.query(sqlCommand,[values,event_id],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Update")
        }
        res.status(200).send(rs)
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('Events', cfg.db_details.events_table, params, cond);
};