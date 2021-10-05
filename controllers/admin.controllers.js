const mongoose = require('mongoose');
const slugify = require('slugify')
const {body, validationResult} = require('express-validator');
const moment = require('moment');
const app = {};


/* Models */
const Catego = require('../model/categories.model')

exports.Login = async (req , res , next) => {
   res.render('index' , {title : "hell"})
}

exports.Post_Login = async (req , res , next) => {
    console.log(req.body);
}


/*  Get Method */
exports.Category = async (req , res, next) => {

}
exports.SubCategory = async (req , res, next) => {

}


/*  Post Method */
exports.Post_Category = async (req , res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect("/admin/banner/create/")
        return;
    }

    if (!req.file) {
        const response_result = {data: req.file, error: true, error_code: 500, message: "file can't empty."};
        res.status(200).send({result: response_result});
        return;
    }



}
exports.Post_SubCategory = async (req , res, next) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect("/admin/banner/create/" + req.params.id)
        return;
    }

    if (!req.file) {
        const response_result = {data: req.file, error: true, error_code: 500, message: "file can't empty."};
        res.status(200).send({result: response_result});
        return;
    }


}




























