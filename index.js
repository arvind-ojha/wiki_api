const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                console.log(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("successfully added");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("successfully deleted all");
            } else {
                res.send(err);
            }
        });
    });
///targeting specific articles    
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("no article matching that title found")
            }
        })
    })
    .put(function (req, res) {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            },
            function (err) {
                if (!err) {
                    res.send("successfully updated article")
                } else {
                    res.send(err)
                }
            })
    })
    .patch(function (req, res) {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err) {
                if (!err) {
                    res.send("successfully updated article")
                } else {
                    res.send(err)
                }
            })
    })
    .delete(function (req, res) {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.send("successfully deleted article")
                } else {
                    res.send(err)
                }
            })
    });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("server is running");
});