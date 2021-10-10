const mongoose = require('mongoose');
const slugify = require('slugify')
const {body, validationResult} = require('express-validator');
const moment = require('moment');
const path = require("path");
const fs = require('fs');
let img_path = path.resolve() + "/public/uploads/";


/* Models */
const Categories = require('../model/categories.model')
const State = require('../model/state.model')
const City = require('../model/city.model')
const Product = require('../model/product.model')
const Keyword = require('../model/keyword.model')


exports.Login = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect('/admin/dashboard')
            return
        }
        // await new Admin({
        //     name : "vikas",
        //     email : "vikas12@gmail.com",
        //     password : "123",
        //     number : "9131341719",
        // }).save();

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
        const category = await Categories.find({$and: [{position: 1}]}).sort({created_at: -1});
        const keyword = await Keyword.find().sort({created_at: -1});
        res.render('product', {app: await appData(), category, keyword})
    } catch (e) {
        next(e)
    }
}
exports.State = async (req, res, next) => {
    try {
        let state = await State.find().sort({created_at: -1})
        res.render('state', {app: await appData(), state})
    } catch (e) {
        next(e)
    }
}
exports.City = async (req, res, next) => {
    try {
        let state = await State.find();
        let city = await City.find().sort({created_at: -1});
        res.render('city', {app: await appData(), city, state})
    } catch (e) {
        next(e)
    }
}
exports.ListProduct = async (req, res, next) => {
    try {
        let state = await State.find();
        let city = await City.find().sort({created_at: -1});
        res.render('product-list', {app: await appData(), city, state})
    } catch (e) {
        next(e)
    }
}
exports.OrderAll = async (req, res, next) => {
    try {
        res.render('order-all', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderPending = async (req, res, next) => {
    try {
        res.render('order-pending', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderConfirmed = async (req, res, next) => {
    try {
        res.render('order-confirmed', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderProcessing = async (req, res, next) => {
    try {
        res.render('order-processing', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderOut_of_delivery = async (req, res, next) => {
    try {
        res.render('order-out_of_delivery', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderDelivery = async (req, res, next) => {
    try {
        res.render('order-delivery', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderReturned = async (req, res, next) => {
    try {
        res.render('order-returned', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderFailed = async (req, res, next) => {
    try {
        res.render('order-failed', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.OrderCanceled = async (req, res, next) => {
    try {
        res.render('order-canceled', {app: await appData()})
    } catch (e) {
        next(e)
    }
}
exports.Keyword = async (req, res, next) => {
    try {
        const keyword = await Keyword.find();
        res.render('keyword', {app: await appData(), keyword})
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

    try {


        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            res.redirect("/admin/product")
            return;
        }

        if (req.files.product_thumb === undefined) {
            const response_result = {data: req.file, error: true, error_code: 500, message: "file can't empty."};
            req.flash('error', "Thumbnail file can't empty.");
            res.redirect("/admin/product")
            return;
        }

        const {
            product_name,
            category,
            sub_category,
            unit_price,
            purchase_price,
            discount,
            discountType,
            total_qty,
            unit,
            desciption,
            keyword
        } = req.body;


        let categorys = [];
        let images = [];

        /*  Start Category  */

        let cat = {};
        cat.cat_id = mongoose.Types.ObjectId(category);
        cat.position = 1;
        categorys.push(cat);

        if (sub_category !== undefined) {
            let cate = {};
            cate.cat_id = mongoose.Types.ObjectId(sub_category);
            cate.position = 2;
            categorys.push(cate);
        }

        /* Images */
        if (req.files.product_img !== undefined) {
            for (let i = 0; i < req.files.product_img.length; i++) {
                images.push(req.files.product_img[i].filename)
            }
        }


        let product = await Product({
            added_by: 'ADMIN',
            name: product_name,
            slug: ConvertSlug(product_name),
            thumbnail: '',
            image: images,
            categories: categorys,
            unit_price: unit_price,
            purchase_price: purchase_price,
            discount: discount,
            discount_type: discountType,
            current_stock: total_qty,
            unit: unit,
            keyword: keyword,
            details: desciption
        });

        await product.save();
        req.flash('success', "Product successfully insert");
        res.redirect("/admin/product")

    }catch (e) {
        next(e)
    }


}
exports.Post_State = async (req , res , next) => {

    try{

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            res.redirect("/admin/state/list")
            return;
        }

        const {name} = req.body;

        const state = new State({
            name : name,
            slug : ConvertSlug(name)
        })

        await state.save();
        req.flash('success', "State successfully insert");
        res.redirect("/admin/state/list")

    } catch (e) {
        next(e)
    }

}
exports.Post_Keyword = async (req, res, next) => {
    try {

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            res.redirect("/admin/keyword")
            return;
        }

        const {keyword_name} = req.body;

        const keyword = new Keyword({
            name : keyword_name,
            slug : ConvertSlug(keyword_name)
        })

        await keyword.save()

        req.flash('success', "Keyword successfully insert");
        res.redirect("/admin/keyword")

    } catch (e) {
        next(e)
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
exports.Delete_State = async (req, res, next) => {

    try {


        const {id} = req.body;

        if (!validId(id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }

        let _id = mongoose.Types.ObjectId(id)
       await State.deleteOne({_id});
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
exports.Patch_State = async (req, res, next) => {

    try {

        const {id, val} = req.body;

        if (!validId(id)) {
            req.flash('error', "Invalid object id!");
            res.status(200).send({error: true, message: "Invalid object id"})
        }
        let _id = mongoose.Types.ObjectId(id)
        let value = (val == "off") ? 'true' : 'false';
        await State.updateOne({_id}, {status: value});
        res.status(200).send({error: false, message: "Update successfully"})


    } catch (e) {
        console.error(e);
        res.status(200).send({error: true, message: e.message})
    }

}


/* Put Request */
exports.Put_Category = async (req, res, next) => {

}


/* Ajax Request */
exports.Ajax_SubCategories = async (req, res, next) => {

    try {

        const {id} = req.body;
        if (!validId(id)) {
            res.send({response: false, data: []})
        }

        let _id = mongoose.Types.ObjectId(id);
        const SubCategory = await Categories.find({$and: [{position: 2}, {parent_id: _id}]}).sort({created_at: -1});

        res.send({response: true, data: SubCategory})

    } catch (e) {
        next(e)
    }

}


function appData() {
    const app = {};
    app.app_name = "Grocery"
    return app;
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





















