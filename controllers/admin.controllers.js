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


/*  Get Request */
exports.Dashboard = async (req, res, next) => {
    try {
        res.render('dashboard', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.Category = async (req, res, next) => {
    try {


        let categories = await Categories.find({position: 1}).sort({created_at: -1});

        res.render('categories', {app: await appData(), categories})

    } catch (e) {
        next(e)
    }
}
exports.SubCategory = async (req, res, next) => {
    try {
        let categories = await Categories.find({position: 1}).sort({created_at: -1});


        let SubCategories = await Categories.aggregate([
            {$match: {position: 2}},
            {
                $lookup: {
                    from: "categories",
                    let: {ids: "$parent_id"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $and:
                                                [
                                                    {$eq: ["$position", 1]},
                                                    {$eq: ["$_id", "$$ids"]}
                                                ]
                                        }
                                }
                        },
                        { $project: { name : 1 } }
                    ],
                    as: 'categories'
                }
            },
            {$unwind: "$categories"}
        ]).sort({created_at: -1});


        res.render('sub-categories', {app: await appData(), SubCategories, categories})
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


/*  Post Request */
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

    try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            res.redirect("/admin/sub-categories")
            return;
        }

        const {name, category} = req.body;

        if (!validId(category)) {
            req.flash('error', "Invalid object id!");
            res.redirect("/admin/sub-categories")
        }

        let _id = mongoose.Types.ObjectId(category)

        const sub_categories = await new Categories({
            name,
            slug: await ConvertSlug(name),
            position: 2,
            parent_id: _id
        });

        await sub_categories.save()

        req.flash('success', "Successfully");
        res.redirect("/admin/sub-categories")

    } catch (e) {
        next(e)
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
exports.Delete_SubCategory = async (req, res, next) => {

    try {


        const {id} = req.body;

        if (!validId(id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(id)
       await Categories.deleteOne({_id});
        req.flash('success', "Successfully");
        res.status(200).send({error: false, message: "delete successfully"})

    } catch (e) {
        console.error(e);
        req.flash('error', "Something went wrong!");
        res.status(200).send({error: true, message: e.message})
    }

}


/* Patch Request */
exports.Patch_CategoryStatus = async (req, res, next) => {

    try {

        const {id, val} = req.body;

        if (!validId(id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }
        let _id = mongoose.Types.ObjectId(id)
        let value = (val == "off") ? 'true' : 'false';
        await Categories.updateOne({_id}, {status: value});
        res.status(200).send({error: false, message: "Update successfully"})


    } catch (e) {
        console.error(e);
        res.status(200).send({error: true, message: e.message})
    }

}


/* Put Request */
exports.Put_Category = async (req, res, next) => {

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





















