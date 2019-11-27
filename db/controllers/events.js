var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();
exports.getEvents = function (req, res, next) {
    // get events created by a certain user 
    var cond = "user_id = '" + req.params.user_id + "' and status < 3";
    console.log(req.query)
    cond+=common.addQueryCond(req.query)
    console.log(cond)
    _getData("*", cond)
        .then(function (data) {
        res.status(200).send(data);
    })
    .catch((err)=> {
        console.log(err.sqlMessage)
        res.status(404).json({error:err.sqlMessage})
    })
};

exports.getInvitedEvents = function(req,res,next){
    // get events invited by user that has not done
    const user_id = req.params.user_id
    const mySQLCommand = `select e.* from events e
    left join invitees i on i.user_id = ${user_id}
    where i.event_id = e.event_id and e.status < 3`
    init.pool.query(mySQLCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).json({error:err.sqlMessage})
        }
        else if (rs.length==0){
            res.status(404).json({error:"Events not found"})
        }
        else{
            res.status(200).send(rs);
        }
    })
}

exports.getConfrimedEvents = function(req,res,next){
    // get all events that user organized or attended (interest = 1) that has been confirmed
    const user_id = req.params.user_id
    const mySQLCommand = `select e.* from events e
    left join invitees i on i.user_id = ${user_id} and e.event_id = i.event_id and i.interest = 1
    where (e.user_id = ${user_id} or i.user_id = ${user_id}) and e.status = 2;`
    init.pool.query(mySQLCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).json({error:err.sqlMessage})
        }
        else if (rs.length==0){
            res.status(404).json({error:"Events not found"})
        }
        else{
            res.status(200).send(rs);
        }
    })

}

exports.postEvents = function(req,res, next){
    const eventdet = req.body
    console.log(eventdet)
    common.insertGenericData('Events', SQLconfig.events_table, eventdet)
    .then(function(data){
        common.getLastInsertID("event_id")
            .then(rs=>{
                console.log(rs)
                res.status(200).json(rs[0])
            })
            .catch(err=>{
                console.log(err.sqlMessage)
                res.status(500).json({error:err.sqlMessage})
            })
        })
    .catch(function(err){
        console.log(err)
        res.status(500).json({error:err.sqlMessage})
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
            res.status(500).json({error:err.sqlMessage})
        }
        else{
            res.status(200).send(rs)
        }
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('Events', SQLconfig.events_table, params, cond);
};