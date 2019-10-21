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

    app.get("/articles", (req, res) => {
        let results = []
        db.Article.remove({})
        .then(
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

                    db.Article.create(newArticle, (err, inserted) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("INSERTED: " + inserted)
                            results.push(newArticle)
                        }
                    })
                })
                res.json(results)
            })
        )
    })


    app.get("/populated", (req, res) => {
        db.Article.find({})
            .populate("notes")
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
    })


    app.get("/", (req, res) => {

        db.Article.find({})
            .then(dbArticle => res.json(dbArticle))
    })
}