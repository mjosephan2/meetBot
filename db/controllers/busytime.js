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
            console.log(err)
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send(JSON.stringify({busy_time:"not found"}))
    })
}

exports.postBusyTime = function(req,res,next){
    const data = req.body
    console.log(data)
    const user_id = data.user_id
    const time = data.time
    common.insertValueToArray(time,user_id)
    console.log(time)
    var sqlCommand = "INSERT INTO busytime(user_id,date_from,date_to) VALUES ?"
    init.pool.query(sqlCommand,[time],(err,rs)=>{
        if (err){
            console.log(err.sqlMessage)
            res.status(404).send("Failed to Insert")
        }
        res.status(200).send(rs)
    })
}
var _getData = function (params, cond) {
    return common.getGenericData('busytime', SQLconfig.busy_table, params, cond);
};