var mongoose = require('mongoose');
const slugify = require('slugify')
const {body, validationResult} = require('express-validator');
var moment = require('moment');
var app = {};



exports.Login = async (req , res , next) => {
   res.render('index' , {title : "hell"})
}

exports.Post_Login = async (req , res , next) => {
    console.log(req.body);
}