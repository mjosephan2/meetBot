var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();

exports.getEventAllPolls = function(req,res,next){
    // this is for the organizer
    // get all the poll and total vote based on event_id
    const event_id = req.params.event_id
    const sqlCommand = `select pd.*, IFNULL(p.vote,0) as total_vote from poll_date pd
    left join (select count(*) as vote, date_id from poll group by poll.date_id) p on p.date_id = pd.date_id
    where event_id = ${event_id};`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).send({error:err.sqlMessage})
        }
        else if (rs.length==0){
            res.status(404).json({error:"Poll is not found"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}

exports.getAllVotedParticipant = function(req,res,next){
    // get everyone who has voted the in the poll for a specific event
    const event_id = req.params.event_id
    const sqlCommand = `select u.*,pd.* from users u
    left join poll_date pd on pd.event_id = ${event_id}
    left join poll p on pd.date_id=p.date_id and p.vote = 1
    left join invitees i on i.invite_id = p.invite_id
    where u.user_id = i.user_id`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).send({error:err.sqlMessage})
        }
        else if (rs.length==0){
            res.status(404).json({error:"Poll is not found"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}

exports.getPollByUserAndEvent =  function(req,res,next){
    // get all available pool for specific event that user is attending
    // return both sum and which events that user has voted before
    const event_id = req.params.event_id
    const user_id = req.params.user_id
    const sqlCommand = `select pd.* , IF(p.invite_id,1,0) as vote, IFNULL(p2.total_vote,0) as total_vote from poll_date pd
    left join invitees i on i.user_id=${user_id} and i.interest=1
    left join poll p on p.invite_id = i.invite_id and p.date_id=pd.date_id and p.vote = 1
    left join (select count(*) as total_vote, date_id from poll where poll.vote = 1 group by poll.date_id) p2 on p2.date_id = pd.date_id
    where pd.event_id = i.event_id and pd.event_id = ${event_id}`
    init.pool.query(sqlCommand,(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).send({error:err.sqlMessage})
        }
        else if (rs.length==0){
            res.status(404).json({error:"Poll is not found"})
        }
        else{
            res.status(200).send(rs)
        }
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
            res.status(500).json({error:"Failed to Insert"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}

exports.postInsertVote = function(req,res,next){
    const data  = req.body;
    console.log(data.invite_id)
    const invite_id = data.invite_id;
    const values = data.date_ids;
    common.insertValueToArray(values,invite_id)
    var sqlCommand = "INSERT INTO poll(invite_id,date_id,vote) VALUES ? ON DUPLICATE KEY UPDATE vote = VALUES(vote)"
    init.pool.query(sqlCommand,[values],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(500).json({error:"Failed to Insert"})
        }
        else{
            res.status(200).send(rs)
        }
    })
}
