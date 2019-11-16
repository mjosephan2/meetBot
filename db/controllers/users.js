var common = require("./common");
var express = require("express");
var init = require('./init')
var {SQLconfig} = require('../config/config');

exports.router = express.Router();
exports.getUser = function (req, res, next) {
    var cond = "user_id = '" + req.params.user_id + "' LIMIT 1";
    console.log(cond)
    _getData("*", cond)
        .then(function (data) {
        res.status(200).send(data[0]);
    })
        .catch((err)=> {
        console.log(err)
        res.status(404).json({error:err.message})
    })
};

exports.postUser = function(req,res, next){
    const userdet = req.body
    console.log(userdet)
    // userdet = {user_id="sadfaf", username="name"}
    common.insertGenericData('users', SQLconfig.users_table, userdet)
    .then(function(data){
        res.status(200).send(data)
    })
    .catch(function(err){
        console.log(err)
        res.status(500).json({error:err.sqlMessage})
    })
}

exports.getAllUserExcept = function(req,res,next){
    var cond = "user_id != '" + req.params.user_id + "'";
    console.log(cond)
    _getData("*", cond)
        .then(function (data) {
        res.status(200).send(data);
    })
        .catch((err)=> {
        console.log(err)
        res.status(404).json({error:err.message})
    })
}

exports.test = function(req,res,next){
    res.status(200).send("Hello")
}
var _getData = function (params, cond) {
    return common.getGenericData('Users', SQLconfig.users_table, params, cond);
};