var common = require('./common')
var init = require('./init')
var express = require('express')
var {SQLconfig} = require('../config/config');

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
            res.status(404).json({error:err.sqlMessage})
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
            res.status(500).json({error:"Failed to Insert"})
        }
        else{
            res.status(200).send(rs)
        }
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
            res.status(500).json({error:"Failed to Update"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('invitees', SQLconfig.invitees_table, params, cond);
};