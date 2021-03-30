import { Router } from 'express';
import Post from '../models/post.model.js';
import Multer from 'multer';

const router = Router();
const multer = Multer();

function getErrorData(err, req){
    let error = {};
    let value = {};
    if (err.name === "MongoError" && err.code === 11000)
        error["slug"] = "Slug is not unique, please change it to another value";
    else {
        for (let errName in err.errors) {
            error[errName] = err.errors[errName].message;
        }
    }
    return error;
}

// CREATE
// Create client interface
router.get("/posts/create", function(req, res, next){
    res.render("create.ejs", { data: {} });
});
// Create server API
router.post("/posts/create", multer.none(), function(req, res, next){
    const slug = req.params.slug;
    Post.create(req.body)
    .then(data => {
        res.status(204).json();
    })
    .catch(err => {
        res.status(400).json({ errors:getErrorData(err) });
    });
});

// READ
// List post
router.get("/", function(req, res, next){
    Post.find()
    .then(posts => {
        res.render('index.ejs', {posts: posts});
    })
    .catch(err => {
        console.error(err);
    });
});
// One post read
router.get("/post/:slug", function(req, res, next){
    const slug = req.params.slug;
    Post.findOne({ slug })
    .then(post => {
        if (post == null) {
            return res.sendStatus(404);
        }
        res.render("read.ejs", {post: post});
    })
    .catch(err => {
        console.log(err);
    });
});

// UPDATE
// Update client interface
router.get("/post/:slug/edit", function(req, res, next){
    const slug = req.params.slug;
    Post.findOne({ slug })
    .then(post => {
        if (post == null) {
            return res.sendStatus(404);
        }
        res.render("edit.ejs", { post: post });
    })
    .catch(err => {
        res.sendStatus(404);
    });
});
router.put("/post/:slug/edit", multer.none(), function(req, res, next){
    const slug = req.params.slug;
    Post.updateOne({ slug },
        {
            $set: {
                title: req.body.title,
                author: req.body.author,
                content: req.body.content
            }
        }, {runValidators: true})
    .then(data => {
        res.status(204).json();
    })
    .catch(err => {
        res.status(400).json({ errors:getErrorData(err) });
    });
});


// DELETE
// Delete API server
router.delete("/post/:slug/delete", function(req, res, next){
    const slug = req.params.slug;
    Post.deleteOne({ slug })
    .then(data => {
        res.status(204).json();
    })
    .catch(error => {res.sendStatus(500); console.error(error);})
});

export default router;
