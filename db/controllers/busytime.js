var common = require('./common')
var init = require('./init')
var express = require('express')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();

exports.getBusyTime = function(req,res,next){
    var cond = `user_id ='${req.params.user_id}'`
    console.log(cond)
    _getData("*",cond)
        .then((data)=>{
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err.sqlMessage)
            res.status(404).json({error:err.message})
    })
}

exports.getParticipantsBusyTime = function(req,res,next){
    // get participant details based on event_id
    const event_id = req.params.event_id
    const sqlCommand = `select u.username,bt.user_id, bt.date_from, bt.date_to, i.priority from busytime bt
    left join invitees i on i.event_id = ${event_id} and i.interest = 1
    left join users u on u.user_id = bt.user_id
    where bt.user_id = i.user_id`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).json({error:err.sqlMessage})
        }
        // json object with user_id, priority
        else if (rs.length==0){
            res.status(404).json({error:"Busytime is not found"})
        }
        else{
            rs = reformat(rs)
            res.status(200).send(rs)
        }
    })
}

exports.postBusyTime = function(req,res,next){
    const data = req.body
    console.log(data)
    const user_id = data.user_id
    const time = data.time
    common.insertValueToArray(time,user_id)
    console.log(time)
    var sqlCommand = `INSERT INTO busytime(user_id,date_from,date_to) VALUES ? 
    ON DUPLICATE KEY UPDATE date_from = VALUES(date_from), date_to = VALUES(date_to)`
    init.pool.query(sqlCommand,[time],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).json({error:"Failed to Insert"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}

function reformat(obj){
    if (!obj.length) return;
    // json object with user_id, priority
    let result = []
    let user = []
    let new_user = {}
    obj.forEach((data,i) => {
        if (user.includes(data.user_id)){
            new_user.schedule.push({start_datetime: data.date_from, end_datetime: data.date_to})
        }
        else{
            if (i!=0) result.push(new_user)
            user.push(data.user_id)
            new_user = {}
            new_user.user_id = data.user_id
            new_user.username = data.username
            new_user.priority = data.priority
            new_user.schedule = []
            new_user.schedule.push({start_datetime: data.date_from, end_datetime: data.date_to})
        }
        if (i==obj.length-1)
            result.push(new_user)
    });
    return result;
}
var _getData = function (params, cond) {
    return common.getGenericData('busytime', SQLconfig.busy_table, params, cond);
};