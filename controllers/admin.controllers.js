const mongoose = require('mongoose');
const slugify = require('slugify')
const {body, validationResult} = require('express-validator');
const moment = require('moment');
const path = require("path");
const fs = require('fs');
let img_path = path.resolve() + "/public/uploads/";
const app = {};


/* Models */
const Categories = require('../model/categories.model')


exports.Login = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect('/auth/admin/dashboard')
            return
        }
        res.render("login")
    } catch (e) {
        next(e);
    }
}


/*  Get Method */
exports.Dashboard = async (req, res, next) => {
    try {
        res.render('dashboard', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.Category = async (req, res, next) => {
    try {


        let categories = await Categories.find().sort({created_at: -1});

        res.render('categories', {app: await appData(), categories})

    } catch (e) {
        next(e)
    }
}
exports.SubCategory = async (req, res, next) => {
    try {
        res.render('sub-categories', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.Product = async (req, res, next) => {
    try {
        res.render('product', {app: await appData()})
    } catch (e) {
        next(e)
    }
}


/*  Post Method */
exports.Post_Category = async (req, res, next) => {

    try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            res.redirect("/admin/categories")
            return;
        }

        if (!req.file) {
            const response_result = {data: req.file, error: true, error_code: 500, message: "file can't empty."};
            req.flash('error', response_result.message);
            res.redirect("/admin/categories")
            return
        }

        const {name} = req.body;

        const categories = await new Categories({
            name,
            slug: await ConvertSlug(name),
            position: 1,
            icon: req.file.filename,
        });

        await categories.save()

        req.flash('success', "Successfully");
        res.redirect("/admin/categories")

    } catch (e) {
        next(e)
    }

}
exports.Post_SubCategory = async (req, res, next) => {

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
exports.Post_Product = async (req, res, next) => {

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


/* Delete Method */
exports.Delete_Category = async (req, res, next) => {

    try {


        const {id} = req.body;

        if (!validId(id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(id)
        const categories = await Categories.findOneAndDelete({_id});
        fs.unlinkSync(img_path + categories.icon)
        req.flash('success', "Successfully");
        res.status(200).send({error: false, message: "delete successfully"})

    } catch (e) {
        console.error(e);
        req.flash('error', "Something went wrong!");
        res.status(200).send({error: true, message: e.message})
    }

}



/* Patch Request */
exports.Patch_CategoryStatus = async (req , res , next) => {

}


function appData() {

}


function ConvertSlug(value) {
    return slugify(value, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',       // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
}

function validId(id) {
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
    return checkForHexRegExp.test(id);
}





















