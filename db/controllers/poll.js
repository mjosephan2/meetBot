var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();

exports.getAllPolls = function(req,res,next){
    // get all available pool for event that the user is attending and is not over if any
    // based on user_id and give back both voted and havent voted

    const event_id = req.params.event_id

}

exports.postInsertPolls = function(req,res,next){
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
const _getPollData = function (params, cond) {
    return common.getGenericData('Poll', SQLconfig.poll_table, params, cond);
};

const _getPollDateData = function (params, cond) {
    return common.getGenericData('Poll Date', SQLconfig.poll_date_table, params, cond);
};