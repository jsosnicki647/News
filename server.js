const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")
const axios = require("axios")
const cheerio = require("cheerio")
const db = require("./models");

const PORT = 3000;
const MONGODB_URL = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })


app.post("/submit", (req, res) => {
    console.log(req.body)
    db.Note.create({note: req.body.note})
    .then(dbNote => {
        console.log(dbNote._id)
        return db.Article.findOneAndUpdate({_id: req.body.article_id}, {$push: {notes: dbNote._id}}, {new: true})
    })
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
})

app.get("/articles", (req, res) => {
    axios.get("https://www.npr.org/sections/news/")
    .then((response) => {
        let $ = cheerio.load(response.data)
        let status
        $("article.item").each((i, element) => {
            let teaser = $(element).children("div.item-info-wrap").children("div.item-info").children("p.teaser").children("a").text()
            let title = $(element).children("div.item-info-wrap").children("div.item-info").children("h2.title").children("a").text()
            let link = $(element).children("div.item-info-wrap").children("div.item-info").children("h2.title").children("a").attr("href")
            db.Article.create({
                teaser: teaser,
                title: title,
                link: link
            },
            (err, inserted) => {
                if (err){
                    console.log(err)
                    status = 200
                }
                else{
                    console.log("INSERTED: " + inserted)
                    status = 500
                }
            })
            .then(() => res.sendStatus(status))
        })
    })
})

app.get("/populated", (req, res) => {
    db.Article.find({})
    .populate("notes")
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
})


app.get("/", (req, res) => {
    // db.Article.remove({})
    // .then(() => {
    db.Article.find({})
    .then(dbArticle => res.json(dbArticle))
    // })
})

app.listen(PORT, () => console.log("App running on port " + PORT + "!"))

