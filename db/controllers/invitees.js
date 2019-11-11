var common = require('./common')
var init = require('./init')
var express = require('express')
var cfg = require('../config/development.json');

exports.router = express.Router();

exports.getInvitees = function(req,res,next){
    cond = `event_id ='${req.params.event_id}'`;
    cond+=common.addQueryCond(req.query)
    console.log(cond)
    _getData("*",cond)
        .then((data)=>{
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err.sqlMessage)
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({busy_time:"not found"}))
    })
}

exports.postInsertInvitees = function(req,res,next){
    const data = req.body
    console.log(data)
    const event_id = data.event_id
    const invitation = data.invitation
    common.insertValueToArray(invitation,event_id)
    // console.log(invitation)
    var sqlCommand = "INSERT INTO invitees(event_id,user_id,priority) VALUES ?"
    init.pool.query(sqlCommand,[invitation],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}

exports.putUpdateInvitees = function(req,res,next){
    // user_id:"",data:{}
    // add constrain later: cannot change invite_id, user_id and event_id
    console.log(req.body)
    const user_id = req.body.user_id;
    const values = req.body.data;
    var sqlCommand = "UPDATE invitees SET ? WHERE user_id=?"
    init.pool.query(sqlCommand,[values,user_id],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Update")
        }
        res.status(200).send(rs)
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('invitees', cfg.db_details.invitees_table, params, cond);
};