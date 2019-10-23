const axios = require("axios")
const cheerio = require("cheerio")
const db = require("../models")

module.exports = function (app) {

    app.post("/submit", (req, res) => {
        console.log(req.body)
        db.Note.create({
                note: req.body.note
            })
            .then(dbNote => {
                console.log(dbNote._id)
                return db.Article.findOneAndUpdate({
                    _id: req.body.article_id
                }, {
                    $push: {
                        notes: dbNote._id
                    }
                }, {
                    new: true
                })
            })
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
    })

    app.get("/", (req, res) => {
        db.Article.remove({}).then(() => {
        let results = []
        axios.get("https://www.npr.org/sections/news/")
            .then((response) => {
                let $ = cheerio.load(response.data)
                $("article.item").each((i, element) => {
                    let teaser = $(element).find("p.teaser").children("a").text().split("• ")[1]
                    let title = $(element).find("h2.title").children("a").text()
                    let link = $(element).find("h2.title").children("a").attr("href")

                    let newArticle = {
                        teaser: teaser,
                        title: title,
                        link: link
                    }

                    results.push(newArticle)
                    db.Article.create(newArticle, (err, inserted) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("INSERTED: " + i + inserted)
                        }
                    })
                })
                 const hbsObject = {
                    articles: results
                }
                res.render("index", hbsObject)
            })
        })
    })


    // app.get("/articles", (req, res) => {
    //     db.Article.find({})
    //         .then(dbArticle => res.render(dbArticle))

    // })


    app.get("/saved", (req, res) => {
        db.Article.find({
                saved: true
            })
            .then(dbArticle => {
                const hbsObject = {
                    articles: dbArticle
                }
                res.render("index", hbsObject)
            })
    })

    app.get("/populated", (req, res) => {
        db.Article.find({})
            .populate("notes")
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
    })


    // app.get("/", (req, res) => {
    //     db.Article.deleteMany({})
    //     db.Article.find({})
    //         .then(dbArticle => {
    //             const hbsObject = {
    //                 articles: dbArticle
    //             }
    //             res.render("index", hbsObject)
    //         })
    //     res.status(200).end()
    // })

    app.put("/save/:id", (req, res) => {
        db.Article.updateOne({
            _id: req.params.id
        }, {
            $set: {
                saved: true
            }
        }, (err, updated) => {
            if (err) {
                console.log(err)
            } else {
                console.log(updated)
                res.status(200).end()
            }
        })
    })
}