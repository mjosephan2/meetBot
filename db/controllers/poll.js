var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();

exports.getEventAllPolls = function(req,res,next){
    // get all poll based on event_id
    const event_id = req.params.event_id
    const sqlCommand = `select pd.*, IFNULL(p.vote,0) as vote from poll_date pd
    left join (select count(*) as vote, date_id from poll group by poll.date_id) p on p.date_id = pd.date_id
    where event_id = ${event_id};`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}

exports.getAllVotedParticipant = function(req,res,next){
    
}
exports.getParticipantAllPolls =  function(req,res,next){
    // get all available pool for event that the user is attending and is not over if any
    // based on user_id and give back both voted and havent voted
    // also return the sum of the vote
    const user_id = req.params.user_id
    const sqlCommand = `select pd.* , IF(p.invite_id,1,0) as voted,  IFNULL(p2.vote,0) as vote from poll_date pd
    left join invitees i on i.user_id=${user_id} and i.interest=1
    left join poll p on p.invite_id = i.invite_id and p.date_id=pd.date_id
    left join (select count(*) as vote, date_id from poll group by poll.date_id) p2 on p2.date_id = pd.date_id
    where pd.event_id = i.event_id`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}
exports.postInsertPollDate = function(req,res,next){
    const data  = req.body;
    console.log(data)
    const event_id = data.event_id;
    const values = common.conv1Dto2D(data.dates,1)
    common.insertValueToArray(values,event_id)
    var sqlCommand = "INSERT INTO poll_date(event_id,date) VALUES ?"
    init.pool.query(sqlCommand,[values],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}


exports.postInsertVote = function(req,res,next){
    const data  = req.body;
    console.log(data)
    const invite_id = data.invite_id;
    const values = common.conv1Dto2D(data.date_ids,1)
    common.insertValueToArray(values,invite_id)
    var sqlCommand = "INSERT INTO poll(invite_id,date_id) VALUES ?"
    init.pool.query(sqlCommand,[values],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}

const _getPollData = function (params, cond) {
    return common.getGenericData('Poll', SQLconfig.poll_table, params, cond);
};

const _getPollDateData = function (params, cond) {
    return common.getGenericData('Poll Date', SQLconfig.poll_date_table, params, cond);
};